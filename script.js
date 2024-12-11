
document.getElementById("upload").onchange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
        return alert("No file selected");
    }
    const data = await readDatabase(await file.arrayBuffer());

    if (data) {
        return downloadCSV("urls\n" + data, "history.csv");
    }
    alert("No data to download");
}

const readDatabase = async (arrayBuffer) => {
    try {
        const SQL = await initSqlJs();
        const db = new SQL.Database(new Uint8Array(arrayBuffer));
        const result = db.exec("SELECT * FROM urls");

        if (result.length === 0) {
            return console.warn("No urls found");
        }
        const rows = result[0].values;
        return rows.map(row => row[1]).join("\n");
    } catch (e) {
        alert("Error: " + e.message);
    }
}

const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
};