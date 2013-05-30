
var instruction_index = 0;
var game_active = false;

$(document).ready(function(){

	var game = new puzzleGame();

	show_menu();
	$('#start_game').click(function(){
	// Launch game
	game_active = true;
	hide_menu();
	displayKeyTab();
	game.startGame();
	});
	$('#game_tips').click(function(){
		hide_menu();
		show_instructions();
		$(".shortNotes").eq(instruction_index).css('display','block');
	});
	$('#game_credits').click(function(){
		hide_menu();
		show_credits();
	});
	$('.prev').click(function(){
		if(instruction_index > 0) {
			$(".shortNotes").eq(instruction_index).css('display','none');
			instruction_index--;
			$(".shortNotes").eq(instruction_index).css('display','block');
		}
	});
	$('.next').click(function(){
		if(instruction_index < ($(".shortNotes").size()-1)) {
			$(".shortNotes").eq(instruction_index).css('display','none');
			instruction_index++;
			$(".shortNotes").eq(instruction_index).css('display','block');
		}
	});
	$('.main_menu_link').click(function(){
		var link_from = $(this).attr('name');
		if(link_from == "instructions"){
			hide_instructions();
			show_menu();
		}
		if(link_from == "credits"){
			hide_credits();
			show_menu();
		}
		if(link_from == "keytab"){
			hideKeyTab();
			show_menu();
		}

	});

	$("#game_canvas").click(function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		game.moveOnClick(x,y);
	})

	$("#game_reset").click(function(){
		game.resetGame();
	});

	$("#game_undo").click(function(){
		game.undoMove();
	});

	$(document).keyup(function(e) {
	  if (game_active == true) { 
	  		if(e.keyCode == 37){game.playLeft();}  //left arrow key
	  		if(e.keyCode == 38){game.playUp();}  //up arrow key
	  		if(e.keyCode == 39){game.playRight();}  //right arrow key
	  		if(e.keyCode == 40){game.playDown();}  //down arrow key
	  }   
	});

	function show_menu(){
		show_lightbox(".backdrop1","#mainMenu");
	}

	function hide_menu(){
		hide_lightbox(".backdrop1","#mainMenu");
	}

	function show_instructions(){
		show_lightbox(".backdrop2","#instructions");
	}

	function hide_instructions(){
		hide_lightbox(".backdrop2","#instructions");
	}

	function show_credits(){
		show_lightbox(".backdrop","#credits");
	}
	function hide_credits(){
		hide_lightbox(".backdrop","#credits");
	}

	function show_lightbox(backdrop, box){
      var top_pos = $("#game_canvas").offset().top;
      var left_pos = $("#game_canvas").offset().left;
      var box_height = $("#game_canvas").height();
      var box_width = $("#game_canvas").width();
      var both_classes = backdrop + "," + box;
      $(backdrop).css("left",left_pos);
      $(backdrop).css("top",top_pos);
      $(backdrop).css('height',box_height);
      $(backdrop).css('width',box_width);
      $(box).css("left",left_pos + 10);
      $(box).css("top",top_pos + 10); 
      $(box).css('height',(box_height - 40));
      $(box).css('width',(box_width - 40));
      $(both_classes).animate({'opacity':'.50'}, 300, 'linear');
      $(box).animate({'opacity':'1.00'}, 300, 'linear');
      $(both_classes).css('display', 'block');
    }

    function hide_lightbox(backdrop,box){
      var both_classes = backdrop + "," + box;
      $(both_classes).animate({'opacity':'0'}, 300, 'linear', function(){
        $(both_classes).css('display', 'none');
      });
    }

    function displayKeyTab(){
    	var canvas_top = $("#game_canvas").offset().top;
      	var canvas_left = $("#game_canvas").offset().left;
      	var canvas_height = $("#game_canvas").height();
      	var canvas_width = $("#game_canvas").width();
      	var tab_top = canvas_top + (canvas_height - 34);
      	$('.game_keys').css('top',tab_top);
      	$('.game_keys').css('left',canvas_left);
      	$('.game_keys').css('width',canvas_width);
      	$('.game_keys').css('display','block');
    }

    function hideKeyTab(){
    	$('.game_keys').css('display','none');
    }

    /* Function to close light box on pressing esc key   */
	$(document).keyup(function(e) {
	  if (e.keyCode == 27 && game.isMessageBoxOpen()) { game.resetGame();}   // esc
	});

	/* funtion to close light box  on clicking the close link*/
	$(document).on('click','.close',function(){
		game.resetGame();
	});
	/* funtion to close light box  on clicking outside the lightbox */
	$('.gamebackdrop').click(function(){
		game.resetGame();
	});

});