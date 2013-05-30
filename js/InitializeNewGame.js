function puzzleGame() {

  // --------------------------- DECLARATIONS ----------------------------
  var canvas = document.getElementById("game_canvas");
  var context = canvas.getContext('2d');

     // Constants............................................................
  var CELL_SIZE=50,
      PLAYER_OFFSET=10,
      ORIGIN_X = 50,
      ORIGIN_Y = 50;

  //-----------------Level 1 Grid info -------------------------

  var total_rows = 0, total_cols = 0, total_blocks=0;
  var win_row = 0, win_col = 0, win_block = "x";
  var path_row = 0, path_col = 0;
  var prev_row = 0, prev_col = 0, prev_block = "x";
  var cur_block_old = "x";
  var is_undo_possible = false;

  var non_stop_blocks_left = 0;
  var is_game_over = false;
  var is_message_displayed = false;


  var blockArray = new Array(3);

     blockArray[0] = new Array("rg","dy","rg");
     blockArray[1] = new Array("uy","ag","dy");
     blockArray[2] = new Array("ag","ly","ly");
     total_rows = 3, total_cols = 3;
     win_row = 1, win_col = 2, win_block = "r";
     total_blocks = total_rows * total_cols;
     non_stop_blocks_left = total_blocks;
     prev_block =  "rg", cur_block_old = "rg";
    
  //Game Block images

     var goLeftBlockGreen  = new Image(),
     goLeftBlockYellow  = new Image(),
     goRightBlockGreen = new Image(),
     goRightBlockYellow = new Image(),
     goDownBlockGreen = new Image(),
     goDownBlockYellow = new Image(),
     goUpBlockGreen = new Image(),
     goUpBlockYellow = new Image(),
     anyWayBlockGreen = new Image,
     anyWayBlockYellow = new Image,
     stopBlock = new Image,
     player = new Image(),
     playerHome = new Image();
     pathway = new Image();
     
     // ---------------Creating level 1 grid --------------------------//
     // notations: s - safeStopBlock   l - goLeftBlock   r - goRightBlock u - goUpBlock   d - goDownBlock
     //            a - anyWayBlock   x - dangerBlock   h - playerHome
     var blockType = {};
     blockType["s"] = stopBlock;
     blockType["rg"] = goRightBlockGreen;
     blockType["ry"] = goRightBlockYellow;
     blockType["lg"] = goLeftBlockGreen;
     blockType["ly"] = goLeftBlockYellow;
     blockType["ug"] = goUpBlockGreen;
     blockType["uy"] = goUpBlockYellow;
     blockType["dg"] = goDownBlockGreen;
     blockType["dy"] = goDownBlockYellow;
     blockType["ag"] = anyWayBlockGreen;
     blockType["ay"] = anyWayBlockYellow;
     blockType["h"] = playerHome;
     
     var player_pos_row = 0;
     var player_pos_col = 0;

     var init_complete = false;

     //declaring functions
     this.startGame = startGame;
     this.resetGame = resetGame;
     this.undoMove = undoMove;
     this.moveOnClick = moveOnClick;
     this.playLeft = playLeft;
     this.playRight = playRight;
     this.playUp = playUp;
     this.playDown = playDown;
     this.isMessageBoxOpen = isMessageBoxOpen;

     //defining functions
     // ------------------------- INITIALIZATION ----------------------------
    function isMessageBoxOpen(){
      if(is_message_displayed == true){
        return true;
      } else{
        return false;
      }
    }

    function startGame() {
      initialize();
    }

    function resetGame(){
      // Store the current transformation matrix
      context.save();

      // Use the identity matrix while clearing the canvas
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Restore the transform
      context.restore();

      //hides any game over or game win messages
      hide_message_screen();

      //Reset and draw
      blockArray[0] = new Array("rg","dy","rg");
      blockArray[1] = new Array("uy","ag","dy");
      blockArray[2] = new Array("ag","ly","ly");
      player_pos_row = 0;
      player_pos_col = 0;
      is_undo_possible = false;
      is_game_over = false;
      non_stop_blocks_left = total_blocks;
      pathway.src = '../img/pathway.png';

      draw();
    }

    function undoMove(){
      if(is_undo_possible) {
        var blockname;
        blockArray[player_pos_row][player_pos_col] = cur_block_old;
        blockArray[prev_row][prev_col] = prev_block;
        blockname=blockType[prev_block];
        x = ORIGIN_X + (prev_col * CELL_SIZE);
        y = ORIGIN_Y + (prev_row * CELL_SIZE);
        context.drawImage(blockname, x, y);
        blockname=blockType[cur_block_old];
        x = ORIGIN_X + (player_pos_col * CELL_SIZE);
        y = ORIGIN_Y + (player_pos_row * CELL_SIZE);
        context.drawImage(blockname, x, y);
        player_pos_row = prev_row;
        player_pos_col = prev_col;
        drawPlayer(player_pos_row,player_pos_col);
        is_undo_possible = false;
        $("#game_undo").removeClass("undo_enable");
        $("#game_undo").addClass("undo_disable");
      }
    }

    function initialize() {
       goLeftBlockGreen.src = '../img/leftArrow_green.png';
       goRightBlockGreen.src = '../img/rightArrow_green.png';
       goDownBlockGreen.src = '../img/downArrow_green.png';
       goUpBlockGreen.src = '../img/topArrow_green.png';
       anyWayBlockGreen.src = '../img/goAnyWay_green.png';
       goLeftBlockYellow.src = '../img/leftArrow_yellow.png';
       goRightBlockYellow.src = '../img/rightArrow_yellow.png';
       goDownBlockYellow.src = '../img/downArrow_yellow.png';
       goUpBlockYellow.src = '../img/topArrow_yellow.png';
       anyWayBlockYellow.src = '../img/goAnyWay_yellow.png';
       stopBlock.src = '../img/safeSpot.png';
       player.src = '../img/player.png';
       playerHome.src = '../img/home.png';
       pathway.src = '../img/pathway.png';
       
       playerHome.onload = function (e) {
          draw();
       };
    }

    function drawGameBoard() {

       var x=0,y=0;
       var blockname=playerHome;
       for(row=0;row<total_rows;row++) {
         x=0;
         y=y+CELL_SIZE;
         for(col=0;col<total_cols;col++) {
          x=x+CELL_SIZE;
          if(blockArray[row][col]) {
          blockname=blockType[blockArray[row][col]];
          }
          context.drawImage(blockname, x, y);
         }
       }  
    }

    //Function to make a move to the left
    function playLeft() {
      var row_num = player_pos_row;
      var col_num = player_pos_col;
      var block1_type,block2_type;
      if(col_num == 0) {
        //not possible to move left
        alert("move not possible!");
      }
      else {
        var next_row = row_num;
        var next_col = col_num - 1;
        block1_type=blockArray[row_num][col_num];
        block2_type=blockArray[next_row][next_col];
        if((block1_type == "lg" || block1_type == "ly" || block1_type == "ag" || block1_type == "ay") && block2_type != 's') {
          swapBlocks(block1_type,row_num,col_num,block2_type,next_row,next_col);
        }
        else {
          movePlayer(row_num,col_num,next_row,next_col);
        }
        
      }
    }

    //Function to make a move to the right
    function playRight() {
      var row_num = player_pos_row;
      var col_num = player_pos_col;
      var block1_type,block2_type;
      if(col_num == (total_cols-1)) {
        //not possible to move right
        alert("move not possible!");
      }
      else {
        var next_row = row_num;
        var next_col = col_num + 1;
        block1_type=blockArray[row_num][col_num];
        block2_type=blockArray[next_row][next_col];
        if((block1_type == "rg" || block1_type == "ry" || block1_type == "ag" || block1_type == "ay") && block2_type != 's') {
          swapBlocks(block1_type,row_num,col_num,block2_type,next_row,next_col);
        }
        else {
          movePlayer(row_num,col_num,next_row,next_col);
        }
        
      }
    }

    //Function to make a move up
    function playUp() {
      var row_num = player_pos_row;
      var col_num = player_pos_col;
      var block1_type,block2_type;
      if(row_num == 0) {
        //not possible to move up
        alert("move not possible!");
      }
      else {
        var next_row = row_num - 1;
        var next_col = col_num;
        block1_type=blockArray[row_num][col_num];
        block2_type=blockArray[next_row][next_col];
        if((block1_type == "ug" || block1_type == "uy" || block1_type == "ag" || block1_type == "ay") && block2_type != 's') {
          swapBlocks(block1_type,row_num,col_num,block2_type,next_row,next_col);
        }
        else {
          movePlayer(row_num,col_num,next_row,next_col);
        }
        
      }
    }

    //Function to make a move down
    function playDown() {
      var row_num = player_pos_row;
      var col_num = player_pos_col;
      var block1_type,block2_type;
      if(row_num == (total_rows-1)) {
        //not possible to move down
        alert("move not possible!");
      }
      else {
        var next_row = row_num + 1;
        var next_col = col_num;
        block1_type=blockArray[row_num][col_num];
        block2_type=blockArray[next_row][next_col];
        if((block1_type == "dg" || block1_type == "dy" || block1_type == "ag" || block1_type == "ay") && block2_type != 's') {
          swapBlocks(block1_type,row_num,col_num,block2_type,next_row,next_col);
        }
        else {
          movePlayer(row_num,col_num,next_row,next_col);
        }
        
      }
    }

    //Function swaps the given blocks
    function swapBlocks(block1_type,block1_row,block1_col,block2_type,block2_row,block2_col) {
       var blockname="",x=0,y=0;
       var is_stop_box_created = false;
       prev_row = block1_row, prev_col = block1_col, prev_block = block1_type;
       cur_block_old = block2_type;
       is_undo_possible = true;
       $("#game_undo").removeClass("undo_disable");
       $("#game_undo").addClass("undo_enable");
       switch (block1_type) {
            case "lg": block1_type = "ly"; break;
            case "rg": block1_type = "ry"; break;
            case "ug": block1_type = "uy"; break;
            case "dg": block1_type = "dy"; break;
            case "ag": block1_type = "ay"; break;
            default: block1_type = "s";
                    non_stop_blocks_left--;
                    is_stop_box_created = true;
          }

       blockArray[block1_row][block1_col] = block2_type;
       blockArray[block2_row][block2_col] = block1_type;
       blockname=blockType[block2_type];
       x = ORIGIN_X + (block1_col * CELL_SIZE);
       y = ORIGIN_Y + (block1_row * CELL_SIZE);
       context.drawImage(blockname, x, y);
       blockname=blockType[block1_type];
       x = ORIGIN_X + (block2_col * CELL_SIZE);
       y = ORIGIN_Y + (block2_row * CELL_SIZE);
       context.drawImage(blockname, x, y);
       drawPlayer(block2_row,block2_col);
       player_pos_row = block2_row;
       player_pos_col = block2_col;
       if(is_stop_box_created){
        check_game_status(block2_row, block2_col);
       }
    }

    function check_game_status(row, col){
      if(non_stop_blocks_left == 1){
        if(blockArray[win_row][win_col] == (win_block + "g") || blockArray[win_row][win_col] == (win_block + "g")){
          show_game_win();
        }
        else{
          show_game_over();
        }
      }
      if(non_stop_blocks_left>1){
        is_game_over = isGameOver (row, col);
        if(is_game_over){
          show_game_over();
        }
      }
    }

    function show_game_win(){
      show_message_screen("YOU WON!");
    }

    function show_game_over(){
      show_message_screen("GAME OVER");
    }



    //Function to move player to the next block
    function movePlayer(cur_row,cur_col,next_row,next_col) {
      var cur_block_type = blockArray[cur_row][cur_col];
      var blockname = blockType[cur_block_type],x=0,y=0;
      prev_row = cur_row, prev_col = cur_col, prev_block = cur_block_type;
      cur_block_old = blockArray[next_row][next_col];
      is_undo_possible = true;
      $("#game_undo").removeClass("undo_disable");
      $("#game_undo").addClass("undo_enable");
      x = ORIGIN_X + (cur_col * CELL_SIZE);
      y = ORIGIN_Y + (cur_row * CELL_SIZE);
      context.save();
      context.fillStyle="#FFFFFF";
      context.fillRect(x,y,CELL_SIZE,CELL_SIZE);
      context.restore();
      context.drawImage(blockname,x,y);
      drawPlayer(next_row,next_col);
      player_pos_row = next_row;
      player_pos_col = next_col;
    }

    //function to check if a block is trapped 
    // A block is blocked if a block other than stop block is surrounded by stop blocks or walls
    function blockStatus(row, col){
      var block_type = blockArray[row][col];
      var block_status = "ok";
      var no_of_blocked_directions = 0;

      if(block_type != "s"){
        //check if left movement is blocked
        if(col == 0 || (blockArray[row][col-1] && blockArray[row][col-1] == "s"))  {
            no_of_blocked_directions++;
            if(block_type == "lg" || block_type == "ly"){
              block_status = "maybe";
            }
        }
        //check if right movement is blocked
        if(col == (total_cols-1) || (blockArray[row][col+1] && blockArray[row][col+1] == "s"))  {
            no_of_blocked_directions++;
            if(block_type == "rg" || block_type == "ry"){
              block_status = "maybe";
            }
        }
        //check if up movement is blocked
        if(row == 0 || (blockArray[row-1][col] && blockArray[row-1][col] == "s"))  {
            no_of_blocked_directions++;
            if(block_type == "ug" || block_type == "uy"){
              block_status = "maybe";
            }
        }
        //check if down movement is blocked
        if(row == (total_rows-1) || (blockArray[row+1][col] && blockArray[row+1][col] == "s"))  {
            no_of_blocked_directions++;
            if(block_type == "dg" || block_type == "dy"){
              block_status = "maybe";
            }
        }
        if(no_of_blocked_directions == 4){
          block_status = "blocked";
        }
      }
      return block_status;
    }

    //checks if any unblocked blocks are present
    function hasMovableBlock(){
      var block_status = "maybe";
      for(var row=0;row<total_rows;row++){
        for(var col=0;col<total_cols;col++){
          var block_type = blockArray[row][col];
          if(block_type != "s"){
            block_status = blockStatus(row,col);
          }
          if(block_status == "ok"){
            return true;
          }
        }
      }
      return false;
    }


    //We check if any surrounding blocks to a newly created stop block is blocked
    //Game over when any block which is not a stop block is blocked
    function isGameOver(row, col){
      var is_block_possible = false;
      var block_status = "ok";
      
      //checks block on the left
      if(col != 0) {
        block_status = blockStatus(row,col-1);
        if(block_status == "blocked"){return true;}  
        if(block_status == "maybe"){is_block_possible = true;};
      }
      //check block on the right
      if(col != (total_cols-1)){
        block_status = blockStatus(row,col+1);
        if(block_status == "blocked"){return true;}  
        if(block_status == "maybe"){is_block_possible = true;};
      }
      //check block above
      if(row != 0){
        block_status = blockStatus(row-1,col); 
        if(block_status == "blocked"){return true;}  
        if(block_status == "maybe"){is_block_possible = true;};
      }
      //check block below
      if(row != (total_rows-1)){
        block_status = blockStatus(row+1,col); 
        if(block_status == "blocked"){return true;}  
        if(block_status == "maybe"){is_block_possible = true;};
      }
      if(is_block_possible){
        if(hasMovableBlock()==false){
          return true;     
        }

      }
      return false;
    }

    //Function to draw player highlight
    function drawPlayer(row,col) {
        //context.drawImage(player,x,y);
        //change player to a semi transparent grey rectangle 
        var x = ORIGIN_X + (col * CELL_SIZE);
        var y = ORIGIN_Y + (row * CELL_SIZE);
        context.save();
        context.globalAlpha = 0.2;
        context.fillStyle="#0000FF";
        context.fillRect(x+2,y+2,CELL_SIZE-4,CELL_SIZE-4);
        context.restore();
    }

    function draw_enclosure(){
      var x = ORIGIN_X - 5;
      var y = ORIGIN_Y - 5;
      var breadth =  (total_cols * CELL_SIZE) + 10;
      var length = (total_rows * CELL_SIZE) + 10; 
      context.beginPath();
      context.lineWidth="4";
      context.strokeStyle="red";
      context.rect(x,x,breadth,length); 
      context.stroke();
    }

    function drawPath(){
      var x = ORIGIN_X + (path_col * CELL_SIZE);
      var y = ORIGIN_Y + (path_row * CELL_SIZE);
      context.drawImage(pathway,x,y);
    }

    //Function to draw castle
    function drawCastle(row, col, dir) {
      path_row = row, path_col = col;
      if(dir == "r") { path_col++; col = col+2; }
      else if (dir == "l") { path_col--; col=col-2;}
      else if (dir == 'u') { path_row--; row=row-2;}
      else { path_row++; row=row+2; }
      drawPath();
      var blockname=playerHome;
      var x = ORIGIN_X + (col * CELL_SIZE);
      var y = ORIGIN_Y + (row * CELL_SIZE);
      context.drawImage(blockname, x, y);
    }


    function draw(now) {
       draw_enclosure();
       drawGameBoard();
       drawPlayer(player_pos_row,player_pos_col);
       drawCastle(win_row, win_col, win_block);
    }

    function moveOnClick(x,y){
      var x_min = ORIGIN_X;
      var y_min = ORIGIN_Y;
      var x_max = ORIGIN_X + (total_cols * CELL_SIZE);
      var y_max = ORIGIN_Y + (total_rows * CELL_SIZE);
      var player_x_min =  ORIGIN_X + (player_pos_col * CELL_SIZE);
      var player_y_min = ORIGIN_Y + (player_pos_row * CELL_SIZE);
      var player_x_max = player_x_min + CELL_SIZE;
      var player_y_max = player_y_min + CELL_SIZE; 
      var isGameBoxClicked = false;

      //movement only possible within the game board
      if(x > x_min && x < x_max && y > y_min && y < y_max){
        isGameBoxClicked = true;
        //to move left or right the player should be in same row
        if(y > player_y_min && y < player_y_max){
          if(x > player_x_max && x < (player_x_max + 50)){ // block to the right is clicked
            playRight();
          }
          if(x > (player_x_min - 50) && x < player_x_min){ //block to the left is clicked
            playLeft();
          }
        }
        //to move up or down the player should be in same column
        if(x > player_x_min && x < player_x_max){
          if(y > player_y_max && y < (player_y_max + 50)){ //block below is clicked
            playDown();
          }
          if(y > (player_y_min - 50) && y < player_y_min){
            playUp();
          }
        }
        return isGameBoxClicked;
      }
    }

    function show_message_screen(message){
      var top_pos = $("#game_canvas").offset().top;
      var left_pos = $("#game_canvas").offset().left;
      var box_height = $("#game_canvas").height();
      var box_width = $("#game_canvas").width();
      var box_content = "<div class=\"close\">x</div><div class=\"message_content\">" + message + "</div>";

      $('.gamebackdrop').css('top',top_pos);
      $('.gamebackdrop').css('left',left_pos);
      $('.gamebackdrop').css('height',box_height);
      $('.gamebackdrop').css('width',box_width);
      $('.box').css('top',(top_pos+box_height-100));
      $('.box').css('left',(left_pos+(box_width/2)-60));
      $('.gamebackdrop, .box').animate({'opacity':'.50'}, 300, 'linear');
      $('.box').animate({'opacity':'1.00'}, 300, 'linear');
      $('.gamebackdrop, .box').css('display', 'block');
      $('.box').html(box_content);
      is_message_displayed = true;
    }

    function hide_message_screen(){
      $('.gamebackdrop, .box').animate({'opacity':'0'}, 300, 'linear', function(){
        $('.gamebackdrop, .box').css('display', 'none');
      });
    }
}
   
   /*blockArray[0] = new Array(safeStopBlock,goLeftBlock,dangerBlock,anyWayBlock,goDownBlock,goRightBlock,dangerBlock,dangerBlock);
   blockArray[1] = new Array(safeStopBlock,anyWayBlock,dangerBlock,dangerBlock,safeStopBlock,anyWayBlock,anyWayBlock,dangerBlock);
   blockArray[2] = new Array(goDownBlock,anyWayBlock,goUpBlock,dangerBlock,dangerBlock,safeStopBlock,dangerBlock,dangerBlock);
   blockArray[3] = new Array(dangerBlock,anyWayBlock,safeStopBlock,dangerBlock,goDownBlock,dangerBlock,dangerBlock,dangerBlock);
   blockArray[4] = new Array(dangerBlock,goDownBlock,dangerBlock,goRightBlock,dangerBlock,dangerBlock,goRightBlock,dangerBlock);
   blockArray[5] = new Array(dangerBlock,dangerBlock,goDownBlock,goRightBlock,anyWayBlock,safeStopBlock,dangerBlock,dangerBlock);
   blockArray[6] = new Array(goRightBlock,safeStopBlock,dangerBlock,dangerBlock,dangerBlock,goRightBlock,anyWayBlock,dangerBlock);
   blockArray[7] = new Array(dangerBlock,dangerBlock,dangerBlock,goDownBlock,dangerBlock,dangerBlock,dangerBlock,playerHome); */
   