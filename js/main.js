'use strict'

const GAMEON = '🙂'
const GAMELOST = '💀'
const FLAG = '📍'
const MINE = '💣'


var gGameField
var gTrueMarked = 0
var gFieldSize
var gPlayTime
var gLives = 3
var gIsGameOn = false

document.oncontextmenu = preventMenue



function init() {

    gGameField = buildBoard(8)

    // gGameField[1][3].mine = true
    // gGameField[2][2].mine = true
    // gGameField[2][2].marked = true
    // gGameField[2][0].isOpen = true
    // renderBoard(gGameField)

    // printDOM(gGameField)
    // cellClicked({i:2,j:2})
    // cellClicked({i:1,j:0})
    renderBeggining()
    // spawnMinesToField(gGameField.length, 1, 1)




}

function buildBoard(size) {


    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            var cell = {
                mine: false,
                marked: false,
                blown: false,
                isOpen: false,
                surroundingMines: 0
            }
            board[i].push(cell)
        }

    }

    return board

}

function spawnMinesToField(event, boardSize, i, j) {



    var mines
    if (boardSize === 4) mines = 2
    if (boardSize === 8) mines = 12
    if (boardSize === 12) mines = 30

    var locArr = []
    for (var m = 0; m < boardSize; m++) {
        for (var n = 0; n < boardSize; n++) {

            if (m === i && n === j) {
                continue
            } else {

                locArr.push({ i: m, j: n })
                // console.log(m, n);
            }
        }
    }

    for (var l = 0; l < mines; l++) {

        var rand = getRndInt(0, locArr.length - 1)
        var currMine = locArr[rand]
        locArr.slice(rand, 1)
        gGameField[currMine.i][currMine.j].mine = true

    }

    markSurroundings()

    if (!gIsGameOn) {
        gIsGameOn = true
        cellClicked(event, i, j)
    }



}


function renderBoard(board) {

    var strHTML = ''
    var cellHTML
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isOpen) {
                //TODO cellHTML = `<td class="cellOpen" >${gGameField[i][j].surroundingMines}</td>`
                cellHTML = `<td class="cellOpen" >${gGameField[i][j].surroundingMines}</td>`
            } else {

                cellHTML = `<td class="unopen" onmouseup="cellClicked(event, ${i}, ${j})"> </td>`
                // console.log(i,j);
            }
            if (board[i][j].blown) {
                cellHTML = `<td class="blown" >💣</td>`
                // continue
            }
            if (board[i][j].marked) {

                cellHTML = `<td class="marked" onmouseup="cellClicked(event, ${i}, ${j})">📍</td>`



            }

            // var cellTest = `<td class="unopen" onclick="testShowLoc(${i},${j})"> </td>`
            strHTML += cellHTML
        }
        strHTML += '</tr>'
    }

    var assignToDom = document.querySelector('.field')
    assignToDom.innerHTML = strHTML

    // console.log(strHTML);


}

function renderBeggining() {

    var strHTML = ''
    var cellHTML
    for (var i = 0; i < gGameField.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gGameField.length; j++) {

            cellHTML = `<td class="unopen" onmouseup="spawnMinesToField(event,${gGameField.length},${i}, ${j})"> </td>`
            strHTML += cellHTML
        }
        strHTML += '</tr>'
    }

    var assignToDom = document.querySelector('.field')
    assignToDom.innerHTML = strHTML

}


function cellClicked(event, i, j) {

    var whichButton = event.button
    // console.log(whichButton);



    switch (whichButton) {

        case 0:

            if (gGameField[i][j].marked) return
            if (gGameField[i][j].blown) return
            if (gGameField[i][j].mine) {
                gGameField[i][j].blown = true
                gLives--
                renderBoard(gGameField)
                // console.log('blow!')
                //TODO: checkGameOver()
            } else {
                if (!gGameField[i][j].isOpen) {
                    gGameField[i][j].isOpen = true
                    expandShown(i, j)
                }

            }
        case 2:

            if (gGameField[i][j].blown) return
            if (gGameField[i][j].marked) {
                gGameField[i][j].marked = false
                renderBoard(gGameField)
                return
            }
            if (!gGameField[i][j].isOpen) {
                gGameField[i][j].marked = true
                renderBoard(gGameField)
                return
            }


    }
    
    renderBoard(gGameField)

}

function cellMarked() {

}

function getNighboursCount(idx, jdx) {


    var threats = 0


    for (var i = idx - 1; i <= idx + 1; i++) {

        if (i < 0 || i >= gGameField.length) continue
        for (var j = jdx - 1; j <= jdx + 1; j++) {

            if (j < 0 || j >= gGameField.length) continue
            if (hasMine(i, j)) threats++
        }

    }



    return threats

}

function markSurroundings() {


    for (var i = 0; i < gGameField.length; i++) {

        for (var j = 0; j < gGameField.length; j++) {

            if (gGameField[i][j].mine) continue
            else {
                gGameField[i][j].surroundingMines = getNighboursCount(i, j)
            }

        }
    }


}



function hasMine(i, j) {


    return gGameField[i][j].mine
}


function expandShown(idx, jdx) {


    if (gGameField[idx][jdx].surroundingMines === 0) {

        for (var i = idx - 1; i <= idx + 1; i++) {

            if (i < 0 || i >= gGameField.length) continue
            for (var j = jdx - 1; j <= jdx + 1; j++) {
    
                if (j < 0 || j >= gGameField.length) continue
                gGameField[i][j].isOpen = true
                // if (gGameField[i][j].surroundingMines === 0) expandShown(i,j)
            }
    
        }
        
    }

}


function reastartGame() {

    gIsGameOn = false
    init()

}

function startTimer() {

}


function testShowLoc(i, j) {
    console.log(i, j)
}

function preventMenue(event) {

    event = event || window.event
    if (event.preventDefault) {
        event.preventDefault()
    } else {
        event.returnValue = false
    }
}

