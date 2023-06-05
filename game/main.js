document.addEventListener('DOMContentLoaded', function () {
    const maze = document.querySelector('.maze');
    const cells = [];

    const mazeSize = 5; // 迷宮的大小，這裡設置為5x5，你可以根據需要進行調整
    let playerPosition = 0;
    let isGameOver = false;

    // 生成迷宮格子
    for (let i = 0; i < mazeSize * mazeSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('block');
        cells.push(cell);
        maze.appendChild(cell);
    }

    // 設置起點和終點
    let start = 0;
    let end = mazeSize * mazeSize - 1;

    // 隨機添加黑色障礙物
    addObstacles(mazeSize, start, end);

    // 設置起點和終點的類別
    cells[start].classList.replace('block', 'start');
    cells[end].classList.replace('block', 'end');
    playerPosition = start;


    // 設置迷宮路徑
    const path = generateRandomPath(start, end, mazeSize);
    path.forEach((index) => {
        cells[index].classList.replace('block', 'path');
    });

    // 監聽鍵盤事件，移動玩家
    document.addEventListener('keydown', function (event) {
        if (!isGameOver) {
            const key = event.key;

            // 上
            if (key === 'ArrowUp') {
                movePlayer(-mazeSize);
            }
            // 下
            else if (key === 'ArrowDown') {
                movePlayer(mazeSize);
            }
            // 左
            else if (key === 'ArrowLeft') {
                movePlayer(-1);
            }
            // 右
            else if (key === 'ArrowRight') {
                movePlayer(1);
            }
        }
    });

    // 移動玩家
    function movePlayer(move) {
        const newPosition = playerPosition + move;

        // 確認新位置是否在迷宮範圍內
        if (newPosition >= 0 && newPosition < mazeSize * mazeSize) {
            // 確認新位置是否為牆壁或障礙物
            if (!cells[newPosition].classList.contains('block') && !cells[newPosition].classList.contains('obstacle')) {
                cells[playerPosition].classList.remove('start');
                cells[playerPosition].classList.add('path');
                cells[newPosition].classList.add('start');
                playerPosition = newPosition;

                // 更新綠色框框的位置
                const mazeDivs = document.querySelectorAll('.maze div');
                mazeDivs.forEach((div, index) => {
                    if (index === newPosition) {
                        div.style.backgroundColor = '#c1a978';
                        div.style.border = 'none';
                    } else {
                        div.style.backgroundColor = '';
                        div.style.border = '';
                    }
                });

                // 確認新位置是否為終點
                if (cells[newPosition].classList.contains('end')) {
                    isGameOver = true;
                    setTimeout(function () {
                        alert('你贏了！折扣碼為：web123');
                        window.location.href = "../homepage/index.html";
                    }, 100);
                }
            } else if (cells[newPosition].classList.contains('obstacle')) {
                // 碰到障礙物，遊戲結束
                isGameOver = true;
                setTimeout(function () {
                    alert('你輸了！');
                    window.location.href = "../homepage/index.html";
                }, 100);
            }
        }
    }
    // 隨機添加黑色障礙物
    function addObstacles(size, start, end) {
        const obstacleCount = Math.floor((size * size) / 8); // 障礙物數量為格子數量的1/8

        for (let i = 0; i < obstacleCount; i++) {
            let obstaclePosition = getRandomPosition(size);
            while (obstaclePosition === start || obstaclePosition === end) {
                obstaclePosition = getRandomPosition(size);
            }
            cells[obstaclePosition].classList.add('obstacle');
        }
    }

    // 生成隨機迷宮路徑
    function generateRandomPath(start, end, size) {
        const visited = new Set();
        const path = [start];
        const stack = [start];

        while (stack.length > 0) {
            const current = stack.pop();
            visited.add(current);

            const neighbors = getNeighbors(current, size);
            const unvisitedNeighbors = neighbors.filter((neighbor) => !visited.has(neighbor));

            if (unvisitedNeighbors.length > 0) {
                stack.push(current);
                const randomNeighbor = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
                path.push(randomNeighbor);
                visited.add(randomNeighbor);
                stack.push(randomNeighbor);
            }
        }

        path.push(end);
        return path;
    }

    // 獲取鄰居格子的索引
    function getNeighbors(index, size) {
        const neighbors = [];

        if (index - size >= 0) {
            neighbors.push(index - size); // 上方格子
        }
        if (index + size < size * size) {
            neighbors.push(index + size); // 下方格子
        }
        if (index % size !== 0) {
            neighbors.push(index - 1); // 左方格子
        }
        if ((index + 1) % size !== 0) {
            neighbors.push(index + 1); // 右方格子
        }

        return neighbors;
    }

    // 獲取隨機位置
    function getRandomPosition(size) {
        return Math.floor(Math.random() * (size * size));
    }

    // 計時器，30秒後遊戲失敗
    const timerElement = document.getElementById('timer');
    let remainingTime = 5;

    function updateTimer() {
        timerElement.textContent = `剩餘時間：${remainingTime} 秒`;
    }

    function countdown() {
        if (!isGameOver) {
            remainingTime--;
            updateTimer();

            if (remainingTime <= 0) {
                isGameOver = true;
                alert('你輸了！');
                window.location.href = "../homepage/index.html";
            } else {
                setTimeout(countdown, 1000);
            }
        }
    }

    countdown();
});
