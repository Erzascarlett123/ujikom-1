// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lysmwvlzitfkohytorcr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5c213dmx6aXRma29oeXRvcmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzMwNDIsImV4cCI6MjA2MDMwOTA0Mn0.JCxjvcZHdFQQGaCF9BQDHvVy6LRns1VRbvrT41m55p0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
