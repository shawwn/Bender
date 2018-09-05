const chess = require('chess.js');

var game;
var times = {};
var msgs = {};
var boardMsg;
var updateInterval;
var lastMoveTime;

exports["new"] = async function(){
  game = new chess.Chess();

  times['b'] = times['w'] = 60 * 1000;

  msgs['b'] = await this.channel.send("s");
  boardMsg = await this.channel.send("```" + fancyBoard(game) + "```");
  msgs['w'] = await this.channel.send("s");

  updateInterval = setInterval(updateClocks, 2000);
};

const updateClocks = () => {
  if (!lastMoveTime) return;

  const turn = game.turn();

  const time = times[turn] + lastMoveTime - (new Date());
  if (time < 0){
    clearInterval(updateInterval);
    // GAME IS OVER
  }
  msgs[turn].edit(time);
};

exports.move = 
async function(move){
  if (lastMoveTime){
    times[game.turn()] += lastMoveTime - (new Date());
  }
  game.move(move);
  await this.delete();
  await boardMsg.edit("```" + fancyBoard(game) + "```");
  lastMoveTime = +(new Date());
}
exports.move.RAW = true;

const fancyBoard = function(g){
  return g.board().map(
    line => line.map(
      piece => (piece && {
        'w': {
          'p':'♟',
          'r':'♜',
          'n':'♞',
          'b':'♝',
          'q':'♛',
          'k':'♚'
        },
        'b': {
          'p':'♙',
          'r':'♖',
          'n':'♘',
          'b':'♗',
          'q':'♕',
          'k':'♔'
        }
      }[piece.color][piece.type] || '　')
    ).join("")
  ).join("\n");
}