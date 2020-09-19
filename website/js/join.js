$(document).ready(function(){

  $('#join-button').on('click',function()
  {

    //Pass Value
    var name = $("#text-field").val();
    localStorage.setItem("name", name);
  });
});
