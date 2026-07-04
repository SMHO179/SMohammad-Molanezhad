const USER = "SMHO179";
const terminal = document.getElementById("terminal");

/* commands */
const commands = {
    whoami: () => "SMHO179 | Backend Developer | Go · Python · Linux · DevOps",

    skills: () => "Go, Python, Linux, Docker, Git, Bash",

    projects: () => "project_status.txt",

    contact: () => `email: SMHO11@protonmail.com
github: https://github.com/SMHO179`,

    help: () => "Available commands: whoami, skills, projects, contact, clear",

    clear: () => {
        terminal.innerHTML = "";
        return null;
    }
};

/* typing effect */
function typeText(text, element, speed = 12) {
    let i = 0;

    return new Promise((resolve) => {
        function type() {
            if (i < text.length) {
                element.textContent += text[i];
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

/* line */
function createLine(cmd) {
    const line = document.createElement("div");
    line.className = "line";

    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = `${USER}@portfolio:~$`;

    const command = document.createElement("span");
    command.className = "command";
    command.textContent = cmd;

    line.appendChild(prompt);
    line.appendChild(command);

    terminal.appendChild(line);
}

/* output */
async function createOutput(text) {
    const out = document.createElement("div");
    out.className = "output";
    terminal.appendChild(out);

    await typeText(text, out);
}

/* run */
async function runCommand(cmd) {
    createLine(cmd);

    const result = commands[cmd];

    if (!result) {
        await createOutput(`command not found: ${cmd}`);
        return;
    }

    const output = result();

    if (output !== null) {
        await createOutput(output);
    }
}

/* input */
document.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
        const cmd = prompt("terminal command:");
        if (cmd) await runCommand(cmd.trim());
    }
});
