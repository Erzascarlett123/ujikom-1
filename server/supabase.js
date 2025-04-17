const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jrltxpskhrqcubtxpewx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybHR4cHNraHJxY3VidHhwZXd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDM1ODMxOSwiZXhwIjoyMDU5OTM0MzE5fQ.ZPsq9unpt5l8R3gR8WEd0dnT6Ubq29geqflur0r39GM"; // ⚠️ Gunakan SERVICE ROLE key, bukan anon key
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
