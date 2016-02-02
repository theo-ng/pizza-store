$(function() {
  var $lop = $('<ul>').appendTo($('#list-pizzas'));

  function addToPizzaList(pizza) {
    var $p = $('<li>').addClass('pizza').appendTo($lop);
    var $name = $('<p>').text("Name: " + pizza.name);
    var $price = $('<p>').text("Price: " + pizza.price);
    var $toppings = $('<p>').text("Toppings: ");
    var $lot = $('<ul>').addClass('toppings');
    var $buttons = $('<p>');
    var $edit = $('<button>').addClass('edit').attr('pid', pizza.id).text('Edit').appendTo($buttons);
    var $del = $('<button>').addClass('delete').attr('pid', pizza.id).text('Delete').appendTo($buttons);

    for(var i=0; i<pizza.toppings.length; i++) {
      $('<li>').text(pizza.toppings[i].name).appendTo($lot)
    }
    $p.append($name).append($price).append($toppings).append($lot).append($buttons);
    
    var pizzas = $('li.pizza');
    var numPizzas = pizzas.length;
    var perPage = 3;
    pizzas.slice(perPage).hide();
    $("#page-nav").pagination({
      items: numPizzas,
      itemsOnPage: perPage,
      cssStyle: "light-theme",
      onPageClick: function(pageNum) {
        var start = perPage * (pageNum - 1)
        var end = start + perPage
        pizzas.hide().slice(start, end).show();
      }
    })
  };

  function getPizzas(pizzas) {
    $.each(pizzas, function(i, pizza) {
      addToPizzaList(pizza);
    });
    bindEvents();
  }

  function toggleEdit(pizza) {
    pizza.children(":first").replaceWith($("<input>").attr("placeholder", pizza.children(":first").text()));
    pizza.children().eq(1).replaceWith($("<input>").attr("placeholder", pizza.children().eq(1).text()));
    // pizza.children().eq(3).replaceWith($("<input>").attr("placeholder", pizza.children().eq(3).text()));
  }

  function hidePizza(pizza) {
    pizza.remove();
  }

  $.getJSON("http://localhost:8080/pizza", getPizzas);

  function bindEvents() {
    $('.edit').on('click', function() {
      toggleEdit($(this.closest('li')));
    });

    $('.save').on('click', function() {
      var pid = $(this).attr('pid');
      console.log('Pizza: '+pid+ ' to be edited');
      // $.ajax({
      //   url: "http://localhost:8080/pizza/"+pid,
      //   method: "PUT",
      //   data: pizza,
      //   success: function() {
      //     alert('Saved');
      //   }
      // });
    });

    $('.delete').on('click', function() {
      var pid = $(this).attr('pid');
      var pizza = $(this).closest('li');
      $.ajax({
        url: 'http://localhost:8080/pizza/'+pid,
        method: 'DELETE',
        success: hidePizza(pizza)
      })
    })
  }

});