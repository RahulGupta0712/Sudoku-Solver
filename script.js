function solveTheSudoku(mat) {

    function isValid(board) {
        let vis = new Array(10).fill(0);

        // row check
        for (let row = 0; row < 9; ++row) {
            for (let i = 0; i < 9; ++i) {
                let ch = board[row][i];
                if (ch != '') {
                    if (vis[ch - '0']) {
                        return false;
                    }
                    else {
                        vis[ch - '0'] = 1;
                    }
                }
            }

            for (let i = 1; i <= 9; ++i) vis[i] = 0;   // reset visited array
        }

        // column check 
        for (let col = 0; col < 9; ++col) {
            for (let i = 0; i < 9; ++i) {
                let ch = board[i][col];
                if (ch != '') {
                    if (vis[ch - '0']) {
                        return false;
                    }
                    else {
                        vis[ch - '0'] = 1;
                    }
                }
            }

            for (let i = 1; i <= 9; ++i) vis[i] = 0;   // reset visited array
        }

        // 3x3 boxes check
        for (let srow = 0; srow < 9; srow += 3) {
            for (let scol = 0; scol < 9; scol += 3) {
                // (srow, scol) is the top-leftmost corner position of the 3x3 box
                for (let i = 0; i < 3; ++i) {
                    for (let j = 0; j < 3; ++j) {
                        let ch = board[srow + i][scol + j];
                        if (ch != '') {
                            if (vis[ch - '0']) {
                                return false;
                            }
                            else {
                                vis[ch - '0'] = 1;
                            }
                        }
                    }
                }

                for (let i = 1; i <= 9; ++i) vis[i] = 0;   // reset visited array
            }
        }

        return true;
    }

    function solveSudoku(sudoku) {
        document.getElementById('solved-sudoku').style.display = 'none'
        document.querySelector('section:nth-child(2)').style.display = 'none'

        if (!isValid(sudoku)) {
            document.querySelector('section:nth-child(2) h1').textContent = "Invalid Sudoku"
            document.querySelector('section:nth-child(2) h1').style.color = 'red'
            return null;
        }

        document.querySelector('section:nth-child(2) h1').textContent = "Here is your solved sudoku:"
        document.querySelector('section:nth-child(2) h1').style.color = 'white'

        let n = 9;

        function exists(num, row, col, board) {
            // check in row
            for (let i = 0; i < n; ++i) {
                if (board[row][i] == num) return 1;
            }

            // check in col
            for (let i = 0; i < n; ++i) {
                if (board[i][col] == num) return 1;
            }

            // check in 3 x 3 box
            let srow = Math.floor(row / 3) * 3, scol = Math.floor(col / 3) * 3;
            for (let r = 0; r <= 2; ++r) {
                for (let c = 0; c <= 2; ++c) {
                    if (board[srow + r][scol + c] == num) return 1;
                }
            }

            return 0;
        }

        function solve(row, col, board) {
            if (col == n) row++, col = 0;
            if (row == n) return 1;

            if (board[row][col] == '') {
                for (let num = '1'; num <= '9'; ++num) {
                    if (!exists(num, row, col, board)) {
                        board[row][col] = num;
                        if (solve(row, col + 1, board)) return 1;
                        board[row][col] = '';
                    }
                }
            }
            else {
                return solve(row, col + 1, board);
            }

            return 0;
        }

        solve(0, 0, sudoku);

        return sudoku
    }

    let solved = solveSudoku(mat)
    document.querySelector('section:nth-child(2)').style.display = 'flex'

    if (solved != null) {
        document.getElementById('solved-sudoku').style.display = 'grid'
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
                let elt = document.getElementById(`ss-id${i}${j}`)
                elt.textContent = `${solved[i][j]}`
            }
        }
    }
}

document.getElementById('solve-btn').addEventListener('click', () => {
    let mat = []
    for (let i = 0; i < 9; ++i) {
        let row = []
        for (let j = 0; j < 9; ++j) {
            let elt = document.getElementById(`id${i}${j}`)
            console.log("value is [" + elt.value + "]")
            if (elt.value != undefined && elt.value != null && elt.value != '' && (elt.value > 9 || elt.value < 1)) {
                document.querySelector('section:nth-child(2) h1').textContent = "Invalid Sudoku"
                document.querySelector('section:nth-child(2) h1').style.color = 'red'
                return;
            }
            row.push(elt.value)
        }
        mat.push(row)
    }

    solveTheSudoku(mat)
})

function fillSudoku(sud){
    for(let i  =0; i < 9; ++i){
        for(let j = 0; j <9; ++j){
            document.getElementById(`id${i}${j}`).value=sud[i][j]
        }
    }
}

document.getElementById('retr-from-text').addEventListener('click', () => {
    let sud = document.getElementById('sudoku-input').value.split('\n')
    let err = document.querySelector('.error-msg-inp')
    err.hidden = true
    if (sud.length != 9) {
        err.hidden = false
        err.textContent = "Invalid Sudoku input"
        return;
    }

    let sudoku = []

    for (let line of sud) {
        if (line.length != 9) {
            err.hidden = false
            err.textContent = "Invalid Sudoku input"
            return;
        }
        let arr = Array.from(line)
        for (let index in arr) {
            if (arr[index] == ' ') {
                arr[index] = '';
            }
        }
        console.log(arr);
        sudoku.push(arr)
    }
    console.log(sudoku);

    fillSudoku(sudoku)
})