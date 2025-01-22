import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/Supabase";

const PDFUploader = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cvExists, setCvExists] = useState(false);
    const localStorageData = JSON.parse(localStorage.getItem("user"));
    const userUid = localStorageData?.uid;

  
    const checkIfPdfExists = async () => {
        try {
            if (!userUid) {
                console.error("❌ Ingen UID hittades i localStorage.");
                setIsLoading(false);
                return;
            }

            const filePath = `${userUid}-cv.pdf`;

            // kolla i supabase storage om filen existerar
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
                setCvExists(true); // Fil existerar
            }
        } catch (error) {
            console.error("❌ Fel vid kontroll av PDF:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hämta och ladda ner PDF
    const fetchAndDownloadPdf = async () => {
        try {
            if (!userUid) {
                console.error("❌ Ingen UID hittades i localStorage.");
                return;
            }

            const filePath = `${userUid}-cv.pdf`;

            // Hämta PDF från Supabase Storage
            const { data: fileData, error } = await supabase.storage
                .from("pdfs")
                .download(filePath);

            if (error) {
                console.error("❌ Kunde inte hämta PDF:", error);
                return;
            }

            if (fileData) {
                // Skapa en nedladdningsbar länk
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

  
            const { data, error } = await supabase.storage
                .from("pdfs")
                .upload(filePath, file, { upsert: true });

            if (error) throw error;

            console.log("✅ Fil uppladdad:", data);
            alert("Filen har laddats upp!");
            setCvExists(true); 
        } catch (error) {
            console.error("❌ Fel vid uppladdning av PDF:", error);
        }
    };

    if (isLoading) {
        return <p>Laddar...</p>;
    }

    if (!userUid) {
        return <p>Ingen användare inloggad. Logga in för att ladda upp ditt CV.</p>;
    }

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
