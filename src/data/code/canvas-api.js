export const canvasApiFiles = [
  { name: 'main.rs', language: 'rust', code: `// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use reqwest::header::AUTHORIZATION;
use serde::Deserialize;
use chrono::DateTime;

#[derive(Deserialize, Debug)]
struct Course {
    id: u32,
    name: String,
    original_name: Option<String>,
}

#[derive(Deserialize)]
struct Assignment {
    name: String,
    due_at: Option<String>,
}

async fn get_courses(api_key: &str) -> Result<Vec<Course>, reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client.get("https://byui.instructure.com/api/v1/courses")
        .header(AUTHORIZATION, format!("Bearer {}", api_key))
        .query(&[("per_page", "100")])
        .send()
        .await?
        .json::<Vec<Course>>()
        .await?;
    Ok(res)
}

async fn get_assignments(api_key: &str, course_id: u32, page: u32) -> Result<Vec<Assignment>, reqwest::Error> {
    let client = reqwest::Client::new();
    let res = client.get(format!("https://byui.instructure.com/api/v1/courses/{}/assignments", course_id))
        .header(AUTHORIZATION, format!("Bearer {}", api_key))
        .query(&[("per_page", "10000"), ("page", &page.to_string())])
        .send()
        .await?
        .json::<Vec<Assignment>>()
        .await?;
    Ok(res)
}

#[tokio::main]
async fn retrieve_wrapped() -> Result<String, Box<dyn std::error::Error>> {
    let current_course_names = ["Fall", "Discrete Mathematics"];
    let mut current_courses: HashMap<String, HashMap<String, String>> = HashMap::new();

    let api_key = "api-key";

    let courses = get_courses(api_key).await?;
    let today = chrono::Utc::now();
    for course in courses {
        if current_course_names.contains(&course.name.as_str()) {
            current_courses.insert(course.original_name.clone().unwrap_or(course.name.clone()), HashMap::new());
            for page in 1.. {
                let assignments = get_assignments(api_key, course.id, page).await?;
                if assignments.is_empty() {
                    break;
                }
                let mut input: HashMap<String, String> = HashMap::new();
                for assignment in assignments {
                    let offset = chrono::Duration::hours(7);
                    let due_date = DateTime::parse_from_rfc3339(&assignment.due_at.unwrap_or("0000-00-00T17:00:00Z"
                                                    .to_string()))?.checked_sub_signed(offset).unwrap();
                    if today < due_date {
                        input.insert(assignment.name.clone(), due_date.clone().to_rfc2822().to_string());
                    }
                }
                current_courses.insert(course.original_name.clone().unwrap_or(course.name.clone()),
                                                    current_courses.get(&course.original_name.clone()
                                                    .unwrap_or(course.name.clone())).insert(&input).to_owned());
            }
        }
    }
    Ok(format!("{:?}", current_courses))
}

#[tauri::command]
fn retrieve() -> String {
    let output = retrieve_wrapped();
    match output {
        Ok(_) => return output.unwrap(),
        Err(_) => return "Unable to retrieve assignments".to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![retrieve])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}` },
  { name: 'index.html', language: 'html', code: `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <link rel="stylesheet" href="styles.css"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Tauri App</title>
    <script type="module" src="/main.js" defer></script>
    <style>
        .logo.vanilla:hover {
            filter: drop-shadow(0 0 2em #ffe21c);
        }
    </style>
</head>

<body>
<form class="row" id="content-form">
    <button type="submit">Load</button>
</form>
<div id="content"></div>
</body>
</html>` },
  { name: 'main.js', language: 'javascript', code: `const { invoke } = window.__TAURI__.tauri;

let contentMsg;
let courses;
let contentString = " ";

async function retrieve(){
    courses = JSON.parse(await invoke("retrieve"));
    contentString = contentString.concat("")
    for (let key in Object.keys(courses)) {
        contentString = contentString.concat("<section><h2>", Object.keys(courses)[key],"</h2>");
        for (let assignment in Object.keys(courses[Object.keys(courses)[key]])){
            contentString = contentString.concat("<p>", Object.keys(courses[Object.keys(courses)[key]])[assignment],
                    " <br><b>Due Around:</b> <br class='due-date-break'>", courses[Object.keys(courses)[key]][Object
                    .keys(courses[Object.keys(courses)[key]])[assignment]], "</p>");
        }
        contentString = contentString.concat("</section>")
    }
    contentMsg.innerHTML = contentString;
}

window.addEventListener("DOMContentLoaded", () => {
  contentMsg = document.querySelector("#content");
  document.querySelector("#content-form").addEventListener("submit", (e) => {
    e.preventDefault();
    retrieve().then;
  });
});` },
  { name: 'style.css', language: 'css', code: `:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #f6f6f6;
  background-color: #2f2f2f;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.row {
  display: flex;
  justify-content: center;
}

div {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

section {
  border-style: none solid;
  border-color: #6f6f6f;
}

section h2, p{
  text-align: center;
  border-style: none none solid;
  border-color: #6f6f6f;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #ffffff;
  background-color: #0f0f0f98;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}
button:active {
  border-color: #396cd8;
  background-color: #0f0f0f69;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}` },
]
