import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Supabase";
import pdfToText from "react-pdftotext";

const PDFUploader = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cvExists, setCvExists] = useState(false);
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    const userUid = localStorageData?.uid;

    // 🔍 Kolla om PDF finns i Supabase
    const checkIfPdfExists = async () => {
        try {
            if (!userUid) {
                console.error("❌ Ingen UID hittades i localStorage.");
                setIsLoading(false);
                return;
            }

            const filePath = `${userUid}-cv.pdf`;

            const { data: fileData, error } = await supabase.storage
                .from("pdfs")
                .download(filePath);

            if (error) {
                if (error.status === 404) {
                    setCvExists(false);
                } else {
                    console.error("❌ Kunde inte kontrollera PDF:", error);
                }
                setIsLoading(false);
                return;
            }

            if (fileData) {
                setCvExists(true);
            }
        } catch (error) {
            console.error("❌ Fel vid kontroll av PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 📥 Hämta och ladda ner PDF
    const fetchAndDownloadPdf = async () => {
        try {
            if (!userUid) {
                console.error("❌ Ingen UID hittades i localStorage.");
                return;
            }

            const filePath = `${userUid}-cv.pdf`;

            const { data: fileData, error } = await supabase.storage
                .from("pdfs")
                .download(filePath);

            if (error) {
                console.error("❌ Kunde inte hämta PDF:", error);
                return;
            }

            if (fileData) {
                const url = window.URL.createObjectURL(fileData);
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

    useEffect(() => {
        checkIfPdfExists();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // 📝 Extrahera text från PDF med react-pdftotext
    const extractTextFromPdf = async (file) => {
        try {
            const text = await pdfToText(file);
            return text;
        } catch (error) {
            console.error("❌ Fel vid text-extraktion från PDF:", error);
            return "";
        }
    };

    // ⬆️ Ladda upp PDF och text till Supabase
    const handleUpload = async () => {
        if (!file) {
            alert("Välj en PDF-fil först!");
            return;
        }

        if (!userUid) {
            alert("Kunde inte hitta användarens UID!");
            return;
        }

        try {
            const filePath = `${userUid}-cv.pdf`;

            // 🟢 Extrahera text från PDF
            const extractedText = await extractTextFromPdf(file);
            console.log("📝 Extraherad text:", extractedText);

            // 🟢 Ladda upp PDF till Supabase Storage
            const { data, error } = await supabase.storage
                .from("pdfs")
                .upload(filePath, file, { upsert: true });

            if (error) throw error;
            console.log("✅ Fil uppladdad:", data);

            // 🟢 Skapa en offentlig URL för PDF
            const { data: publicUrlData } = supabase.storage
                .from("pdfs")
                .getPublicUrl(filePath);
            const pdfUrl = publicUrlData.publicUrl;

            // 🟢 Lagra PDF-URL och extraherad text i `user_pdfs`
            const { error: pdfDbError } = await supabase
                .from("user_pdfs")
                .upsert([{ user_id: userUid, pdf_url: pdfUrl, cv_text: extractedText }]);

            if (pdfDbError) throw pdfDbError;

            alert("Filen har laddats upp och texten är sparad!");
            setCvExists(true);
        } catch (error) {
            console.error("❌ Fel vid uppladdning av PDF:", error);
        }
    };

    return (
        <div>
            {!cvExists && (
                <>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Ladda upp ditt CV</button>
                </>
            )}
            {cvExists && (
                <button onClick={fetchAndDownloadPdf}>Ladda ner ditt CV</button>
            )}
        </div>
    );
};

export default PDFUploader;
