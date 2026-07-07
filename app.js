document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");
    const output = document.getElementById("output");
    const input = document.getElementById("cmd");
    const form = document.getElementById("form");

    const commands = {
        help: () => {
            print("Available commands:");
            print("help, whoami, skills, projects, contact, clear");
        },

        whoami: () => print("SMHO179 | Backend Developer | Go · Python · Linux · DevOps"),

        skills: () => print("Go, Python, Docker, Kubernetes, Linux"),

        contact: () => print(
`Email: SMHO11@protonmail.com
GitHub: https://github.com/SMHO179`
        ),

        projects: () => print(
`camera-lock
GoWeather
metadata-viewer
fastfetch-config`
        ),

        clear: () => {
            output.innerHTML = "";
            boot();
            return false;
        }
    };

    function print(text) {
        const div = document.createElement("div");
        div.className = "output";
        div.textContent = text;
        output.appendChild(div);
    }

    function printType(text, speed = 15, cb) {
        const div = document.createElement("div");
        div.className = "output";
        output.appendChild(div);

        let i = 0;

        (function type() {
            if (i < text.length) {
                div.textContent += text[i++];
                setTimeout(type, speed);
            } else if (cb) cb();
        })();
    }

    function runCommand(cmd) {
        const value = cmd.trim().toLowerCase();

        print(`~/portfolio $ ${value}`);

        if (commands[value]) {
            const result = commands[value]();
            if (result === false) return;
        } else {
            print(`command not found: ${value}`);
        }
    }

    function boot() {
        printType("booting SMHO179 terminal...", 12, () => {
            print("system ready.");
            print("type 'help' to begin.");

            setTimeout(() => commands.help(), 300);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        runCommand(input.value);
        input.value = "";
        input.focus();
    });

    terminal.addEventListener("click", () => input.focus());

    boot();
});
