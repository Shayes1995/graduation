import { createClient } from '@supabase/supabase-js';
import { useEffect } from 'react';
 
const supabaseUrl = "https://eebbwtkghyyqjlphiuer.supabase.co";  // Finns i din Supabase dashboard
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlYmJ3dGtnaHl5cWpscGhpdWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NzA2OTcsImV4cCI6MjA1MzA0NjY5N30.UK2_ZxjGWrrMkmMx_g0li-ANWnN7xkpQc8B6Y90wYuk";  // Finns i din Supabase dashboard
 
 
export const supabase = createClient(supabaseUrl, supabaseKey);
 
 
const testSupabaseStorage = async () => {
    try {
        const { data, error } = await supabase.storage.from("pdfs").list();
        if (error) throw error;
        console.log("✅ Supabase Storage funkar! Filer:", data);
    } catch (error) {
        console.error("❌ Fel vid anslutning till Supabase Storage:", error);
    }
};
 

const SupabaseTest = () => {
    useEffect(() => {
        testSupabaseStorage();
    }, []);
 
    return <p>Kolla konsolen för att se om Supabase Storage är ansluten.</p>;
};
 
export default SupabaseTest;
