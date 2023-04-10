
module.exports = getDate
// console.log(module);
function getDate(){
  let today = new Date();
  let currentDay = today.getDate();
  let options ={
    weekday: "long",
    day: "numeric",
    month : "long"
  };
  let day =today.toLocaleDateString("en-IN",options);
  return day;
}
