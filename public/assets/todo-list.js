$(document).ready(function(){

  $('form').on('submit', function(){

      var item = $('form input');
      var todo = {item: item.val()};

      $.ajax({
        type: 'POST',
        url: '/todo',
        data: todo,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });

  $('li').on('click', function(){
      var item = $(this).text();
      $.ajax({
        type: 'GET',
        url: '/searched',
        success: function(data){
          //do something with the data via front-end framework
          //location.reload();
        }
      });
  });

});
