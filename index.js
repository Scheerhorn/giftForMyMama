import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase credentials
const supabaseUrl = 'https://gncuceykpvvqjxwlfeje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduY3VjZXlrcHZ2cWp4d2xmZWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzU3MDAsImV4cCI6MjA3Nzg1MTcwMH0.9djLfnEIS9U6zz0MyutrZ75iiFNZLaL3qzVw66P8fFE';
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM elements
const thingInput = document.getElementById('thingInput');
const nameInput = document.getElementById('nameInput');
const button = document.getElementById('submitBtn');
const status = document.getElementById('status');
const list = document.getElementById('thingsList');

// Fetch and display all entries
async function fetchThings() {
    const { data, error } = await supabase
    .from('data')
    .select('thing_done, submitted_by')
    .order('created_at', { ascending: false });

    if (error) {
    status.textContent = 'Error fetching data.';
    console.error(error);
    return;
    }

    list.innerHTML = '';
    data.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `"${item.thing_done}" — <em>Submitted by: ${item.submitted_by || 'Anonymous'}</em>`;
    list.appendChild(li);
    });
}

// Insert new entry
async function insertThing() {
    const thing = thingInput.value.trim();
    const name = nameInput.value.trim() || 'Anonymous';
    if (!thing) return;

    status.textContent = 'Submitting...';

    const { error } = await supabase
    .from('data')
    .insert([{ thing_done: thing, submitted_by: name }]);

    if (error) {
    status.textContent = 'Error inserting data.';
    console.error(error);
    } else {
    status.textContent = 'Added!';
    thingInput.value = '';
    nameInput.value = '';
    fetchThings();
    }
}

// Event listener
button.addEventListener('click', insertThing);

// Load items on page load
fetchThings();
