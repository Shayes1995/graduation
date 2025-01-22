import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Supabase";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker";

const PDFUploader = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cvExists, setCvExists] = useState(false);
    const [extractedText, setExtractedText] = useState(""); //  Lagrar extraherad text
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    const userUid = localStorageData?.uid;

    //  Kolla om PDF finns i Supabase
    const checkIfPdfExists = async () => {
        try {
            if (!userUid) {
                console.error("Ingen UID hittades i localStorage.");
                setIsLoading(false);
                return;
            }

            // 🔍 Hämta PDF-URL från databasen
            const { data, error } = await supabase
                .from("user_pdfs")
                .select("pdf_url, cv_text") // Hämtar också texten för att säkerställa att den sparats
                .eq("user_id", userUid)
                .maybeSingle(); 

            if (error) {
                console.error("❌ Fel vid kontroll av PDF:", error);
                setIsLoading(false);
                return;
            }

            if (!data || !data.pdf_url) {
                console.log("⚠️ Ingen PDF hittades i databasen.");
                setCvExists(false);
                setIsLoading(false);
                return;
            }

            console.log("✅ PDF hittades i databasen:", data.pdf_url);
            console.log("📝 Sparad text i databasen:", data.cv_text);
            setCvExists(true);
        } catch (error) {
            console.error("❌ Oväntat fel vid kontroll av PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkIfPdfExists();
    }, []);

    // När användaren väljer en fil, extrahera text direkt
    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            try {
                const text = await extractTextFromPdf(selectedFile);
                setExtractedText(text); // 🔥 Uppdaterar texten i interfacet
                console.log("📝 Extraherad text från PDF:", text);
            } catch (error) {
                console.error("❌ Fel vid text-extraktion:", error);
                setExtractedText("Kunde inte extrahera text från PDF.");
            }
        }
    };

    // 📝 Extrahera text från PDF med pdfjs-dist
    const extractTextFromPdf = async (file) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
                    let text = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        text += content.items.map(item => item.str).join(" ") + "\n";
                    }
                    resolve(text);
                } catch (error) {
                    reject(error);
                }
            };
        });
    };
    

    //  Ladda upp PDF och text till Supabase
    const handleUpload = async () => {
        if (!file) {
            alert("Välj en PDF-fil först!");
            return;
        }
    
        try {
            const filePath = `pdfs/${userUid}-cv.pdf`; // Sätt rätt path
    
            // Extrahera text från PDF
            const extractedText = await extractTextFromPdf(file);
            console.log("📝 Extraherad text:", extractedText);
    
            // Ladda upp PDF till Supabase Storage
            const { data, error } = await supabase.storage
                .from("pdfs")
                .upload(filePath, file, { upsert: true });
    
            if (error) throw error;
            console.log("✅ Fil uppladdad:", data);
    
            // Skapa en offentlig URL för PDF
            const { data: publicUrlData } = supabase.storage
                .from("pdfs")
                .getPublicUrl(filePath);
            const pdfUrl = publicUrlData.publicUrl;
    
   
            const { error: pdfDbError } = await supabase
                .from("user_pdfs")
                .upsert([{ user_id: userUid, pdf_url: pdfUrl, cv_text: extractedText }]);
    
            if (pdfDbError) throw pdfDbError;
    
            alert("Filen har laddats upp och texten är sparad!");
            setCvExists(true);
        } catch (error) {
            console.error("Fel vid uppladdning av PDF:", error);
        }
    };
    


    const fetchAndDownloadPdf = async () => {
        try {
            if (!userUid) {
                console.error("❌ Ingen UID hittades i localStorage.");
                return;
            }
    
            const filePath = `pdfs/${userUid}-cv.pdf`; // Uppdaterad sökväg
    
            const { data, error } = await supabase.storage
                .from("pdfs")
                .download(filePath);
    
            if (error) {
                console.error("❌ Kunde inte hämta PDF:", error);
                return;
            }
    
            if (data) {
                const url = window.URL.createObjectURL(data);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `${userUid}-cv.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error("❌ Fel vid nedladdning av PDF:", error);
        }
    };
    

    //  Ta bort PDF från Supabase
    const handleDelete = async () => {
        if (!userUid) {
            alert("Kunde inte hitta användarens UID!");
            return;
        }

        try {
            const filePath = `${userUid}-cv.pdf`;

            // Ta bort PDF från Supabase Storage
            const { error: deleteError } = await supabase.storage
                .from("pdfs")
                .remove([filePath]);

            if (deleteError) {
                console.error("❌ Fel vid borttagning av PDF från storage:", deleteError);
                alert("Kunde inte ta bort filen från storage!");
                return;
            }

            console.log("✅ PDF borttagen från storage");

            // Ta bort URL och text från databasen
            const { error: dbDeleteError } = await supabase
                .from("user_pdfs")
                .delete()
                .eq("user_id", userUid);

            if (dbDeleteError) {
                console.error(" Fel vid borttagning från databasen:", dbDeleteError);
                alert("Kunde inte radera metadata från databasen!");
                return;
            }

            alert("CV har tagits bort!");
            setCvExists(false);
        } catch (error) {
            console.error(" Fel vid borttagning av PDF:", error);
        }
    };

    return (
        <div>
            {!cvExists && (
                <>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    {file && (
                        <div>

                            <button onClick={handleUpload}>Ladda upp ditt CV</button>
                        </div>
                    )}
                </>
            )}
            {cvExists && (
                <>
                    <button onClick={fetchAndDownloadPdf}>Ladda ner ditt CV</button>
                    <button onClick={handleDelete}>Ta bort ditt CV</button>
                </>
            )}
        </div>
    );
};

export default PDFUploader;
