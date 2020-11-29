export function dateFormat(date) {
  if (!date) return "No hay fecha";
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  var dt = typeof date === "string" ? new Date(date) : date;
  return dt.toLocaleDateString("es-CO", options);
}
