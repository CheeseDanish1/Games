const $board = $('#board')
const ROWS = 10;
const COLS = 10;
let bombs = 0;
let bombsRem = 0;

function createBoard(r, c) {
    $board.empty();
    for (let i = 0; i < r; i++) {
        const $row = $('<div>').addClass('row');
        for (let j = 0; j < c; j++) {
            const $col = $('<div>').addClass('col hidden').attr('data-row', i).attr('data-col', j)
            if (Math.random() < 0.15) {
                $col.addClass('mine');
                bombs++;
            }
            $row.append($col)
        }
        $board.append($row)
    }
    bombsRem = bombs;
    $('#bombs').text(`Total Bombs ${bombs} -------- Bombs Left ${bombsRem}`);
}

function restart() {
    sec = 0;
    bombs = 0;
    bombsRem = 0;
    $("#seconds").html("00");
    $("#minutes").html("00");
    createBoard(ROWS, COLS)
}

function gameOver(isWin) {
    let message = null;
    let icon = null;
    if (isWin) {
        $('#bombs').text(`Total Bombs ${bombs} -------- Bombs Left 0`);
        message = 'You won!';
        icon = 'fa fa-flag';
    } else {
        $('#bombs').text(`Total Bombs ${bombs} -------- Bombs Left ${bombs}`);
        message = 'You lost';
        icon = 'fa fa-bomb';
    }

    let i = $('i');
    for (let j = 0; j < i.length; j++) {
        i[j].remove()
    }

    $('.col.mine').append($('<i>').addClass(icon));
    $('.col:not(.mine)').html(function () {
        const $cell = $(this);
        const count = getMineCount($cell.data('row'), $cell.data('col'), );
        return count === 0 ? '' : count;
    })
    $('.col.hidden').removeClass('hidden');
    setTimeout(function () {
        alert(message);
        restart();
    }, 1001);
}

function reveal(oi, oj) {
    const seen = {};

    function helper(i, j) {
        if (i >= ROWS || j >= COLS || i < 0 || j < 0) return;
        const key = `${i} ${j}`

        if (seen[key]) return;
        const $cell = $(`.col.hidden[data-row=${i}][data-col=${j}]`);
        const mineCount = getMineCount(i, j);
        if (!$cell.hasClass('hidden') || $cell.hasClass('mine')) return;

        $cell.removeClass('hidden');

        if (mineCount) {
            $cell.text(mineCount);
            return;
        }

        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                helper(i + di, j + dj);
            }
        }
    }
    helper(oi, oj);
}

function getMineCount(i, j) {
    let count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            const ni = i + di;
            const nj = j + dj;
            if (ni >= ROWS || nj >= COLS || nj < 0 || ni < 0) continue;
            const $cell =
                $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
            if ($cell.hasClass('mine')) count++;
        }
    }
    return count;
}

$board.on('contextmenu', '.col.hidden', function (e) {
    e.preventDefault();
    const icon = 'fa fa-exclamation';
    const $cell = $(this)
    const $i = e.currentTarget.children[0];
    if (!$i) {
        if (bombsRem <= 0) return;
        $cell.append($('<i>').addClass(icon));
        bombsRem--
        $('#bombs').text(`Total Bombs ${bombs} -------- Bombs Left ${bombsRem}`);
    } else {
        $i.remove();
        bombsRem++
        $('#bombs').text(`Total Bombs ${bombs} -------- Bombs Left ${bombsRem}`);
    }
    return;
})

$board.on('click', '.col.hidden', function () {
    const $cell = $(this)
    const row = $cell.data('row');
    const col = $cell.data('col');
    if ($cell.hasClass('mine')) gameOver(false)
    else {
        reveal(row, col)
        const isGameOver = $('.col.hidden').length == $('.col.mine').length
        if (isGameOver) gameOver(true)
    }
})

var sec = 0;

const pad = val => {
    return val > 9 ? val : "0" + val;
}
const idk = setInterval(() => {
    $("#seconds").html(pad(++sec % 60));
    $("#minutes").html(pad(parseInt(sec / 60, 10)));
}, 1000);

restart();