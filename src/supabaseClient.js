// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jrltxpskhrqcubtxpewx.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpybHR4cHNraHJxY3VidHhwZXd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTgzMTksImV4cCI6MjA1OTkzNDMxOX0.cozB-h4jciY1oLqowhI78hV3lLWjxqYNMjPN48P6o1U'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
