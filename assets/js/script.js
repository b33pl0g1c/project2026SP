/* ========================================
   Valentine Website - JavaScript
   ======================================== */

// ============ Stage Navigation ============

function nextStage(stageNum) {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
    });

    // Show target stage
    const targetStage = document.getElementById('stage' + stageNum);
    if (targetStage) {
        setTimeout(() => {
            targetStage.classList.add('active');

            // Initialize stage-specific features
            if (stageNum === 1) {
                initSignatureCanvas();
            } else if (stageNum === 2) {
                initTicTacToe();
            } else if (stageNum === 3) {
                initNoButton();
            } else if (stageNum === 4) {
                startFloatingHearts();
            } else if (stageNum === 5) {
                playWallOfHeartsMusic();
            }
        }, 100);
    }
}

// Audio for Wall of Hearts
let wallOfHeartsAudio = null;

function playWallOfHeartsMusic() {
    if (!wallOfHeartsAudio) {
        wallOfHeartsAudio = new Audio('assets/audio/background-music.mp3');
        wallOfHeartsAudio.loop = true;
        wallOfHeartsAudio.volume = 0.3; // Sweet background volume (30%)
    }
    wallOfHeartsAudio.currentTime = 0;
    wallOfHeartsAudio.play().catch(err => console.log('Audio playback failed:', err));
}

// Wall of Hearts Loading Screen
function showWallLoading() {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
    });

    // Show loading stage
    const loadingStage = document.getElementById('stageWallLoading');
    if (loadingStage) {
        loadingStage.classList.add('active');

        // After 2 seconds, go to Wall of Hearts
        setTimeout(() => {
            nextStage(5);
        }, 2000);
    }
}

function stopWallOfHeartsMusic() {
    if (wallOfHeartsAudio) {
        wallOfHeartsAudio.pause();
        wallOfHeartsAudio.currentTime = 0;
    }
}

function replay() {
    // Reset signature canvas
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Hide submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.classList.add('hidden');

    // Reset tic-tac-toe
    resetTicTacToe();

    // Clear floating hearts
    const heartsContainer = document.getElementById('floatingHearts');
    if (heartsContainer) heartsContainer.innerHTML = '';

    // Stop music
    stopWallOfHeartsMusic();

    // Go to stage 0
    nextStage(0);
}

// ============ Loading Screen ============

function showLoading() {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
    });

    // Show loading stage
    const loadingStage = document.getElementById('stageLoading');
    if (loadingStage) {
        loadingStage.classList.add('active');

        // After 1.5 seconds, go to tic-tac-toe
        setTimeout(() => {
            nextStage(2);
        }, 1500);
    }
}

// ============ Signature Canvas ============

let isDrawing = false;
let hasDrawn = false;

function initSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas size to match container
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Reset state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn = false;
    document.getElementById('submitBtn').classList.add('hidden');

    // Drawing style
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function getTouchPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

function startDrawing(e) {
    isDrawing = true;
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!isDrawing) return;
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const pos = getMousePos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (!hasDrawn) {
        hasDrawn = true;
        document.getElementById('submitBtn').classList.remove('hidden');
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    isDrawing = true;
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const pos = getTouchPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const pos = getTouchPos(canvas, e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (!hasDrawn) {
        hasDrawn = true;
        document.getElementById('submitBtn').classList.remove('hidden');
    }
}

function stopDrawing() {
    isDrawing = false;
}

// ============ Tic Tac Toe ============

let board = ['', '', '', '', '', '', '', '', ''];
let playerTurn = true;
let gameOver = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function initTicTacToe() {
    resetTicTacToe();

    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(index));
    });
}

function resetTicTacToe() {
    board = ['', '', '', '', '', '', '', '', ''];
    playerTurn = true;
    gameOver = false;

    const cells = document.querySelectorAll('.ttt-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
    });

    document.getElementById('turnText').textContent = 'Your turn';
    document.getElementById('gameResult').classList.add('hidden');
    document.getElementById('continueBtn').classList.add('hidden');

    const winLine = document.getElementById('winLine');
    if (winLine) {
        winLine.classList.remove('show');
        winLine.style.cssText = '';
    }
}

function handleCellClick(index) {
    if (!playerTurn || gameOver || board[index] !== '') return;

    // Player move (heart)
    board[index] = '❤️';
    const cells = document.querySelectorAll('.ttt-cell');
    cells[index].textContent = '❤️';

    // Check for player win
    if (checkWin('❤️')) {
        playerWins();
        return;
    }

    // Check for draw
    if (board.every(cell => cell !== '')) {
        // If draw, reset and let player try again
        setTimeout(() => resetTicTacToe(), 1000);
        return;
    }

    // AI turn
    playerTurn = false;
    document.getElementById('turnText').textContent = 'AI thinking...';

    setTimeout(() => {
        aiMove();
        playerTurn = true;

        if (!gameOver) {
            document.getElementById('turnText').textContent = 'Your turn';
        }
    }, 600);
}

function aiMove() {
    if (gameOver) return;

    // AI is rigged to let player win - makes bad moves
    // First, avoid blocking player's winning moves
    // Pick a random empty cell that doesn't help player lose

    const emptyCells = board
        .map((cell, i) => cell === '' ? i : -1)
        .filter(i => i !== -1);

    if (emptyCells.length === 0) return;

    // Find cells that would NOT block player
    let badMoves = [];
    let neutralMoves = [];

    for (const cellIndex of emptyCells) {
        // Check if this blocks a player win
        let blocksWin = false;
        for (const pattern of winPatterns) {
            if (pattern.includes(cellIndex)) {
                const otherCells = pattern.filter(i => i !== cellIndex);
                if (otherCells.every(i => board[i] === '❤️')) {
                    blocksWin = true;
                    break;
                }
            }
        }

        if (!blocksWin) {
            badMoves.push(cellIndex); // Good for letting player win
        } else {
            neutralMoves.push(cellIndex);
        }
    }

    // Prefer moves that don't block player
    const movePool = badMoves.length > 0 ? badMoves : neutralMoves;
    const aiChoice = movePool[Math.floor(Math.random() * movePool.length)];

    board[aiChoice] = '✕';
    const cells = document.querySelectorAll('.ttt-cell');
    cells[aiChoice].textContent = '✕';
}

function checkWin(symbol) {
    for (const pattern of winPatterns) {
        if (pattern.every(i => board[i] === symbol)) {
            return pattern;
        }
    }
    return null;
}

function playerWins() {
    gameOver = true;
    const winPattern = checkWin('❤️');

    // Draw win line
    if (winPattern) {
        drawWinLine(winPattern);
    }

    setTimeout(() => {
        document.getElementById('turnText').textContent = '';
        document.getElementById('gameResult').classList.remove('hidden');
        document.getElementById('continueBtn').classList.remove('hidden');
    }, 500);
}

function drawWinLine(pattern) {
    const board = document.getElementById('tttBoard');
    const winLine = document.getElementById('winLine');
    const cells = document.querySelectorAll('.ttt-cell');

    const boardRect = board.getBoundingClientRect();
    const startCell = cells[pattern[0]].getBoundingClientRect();
    const endCell = cells[pattern[2]].getBoundingClientRect();

    const startX = startCell.left + startCell.width / 2 - boardRect.left;
    const startY = startCell.top + startCell.height / 2 - boardRect.top;
    const endX = endCell.left + endCell.width / 2 - boardRect.left;
    const endY = endCell.top + endCell.height / 2 - boardRect.top;

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    winLine.style.left = startX + 'px';
    winLine.style.top = startY + 'px';
    winLine.style.width = length + 'px';
    winLine.style.transform = `rotate(${angle}deg)`;
    winLine.classList.add('show');
}

// ============ No Button Evasion ============

let noButtonAttempts = 0;

function initNoButton() {
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;

    // Reset state
    noButtonAttempts = 0;
    noBtn.style.position = 'fixed';
    noBtn.style.display = 'inline-block';
    noBtn.style.transition = 'all 0.15s ease-out';

    // Position it initially
    const rect = noBtn.getBoundingClientRect();
    noBtn.style.left = rect.left + 'px';
    noBtn.style.top = rect.top + 'px';

    noBtn.addEventListener('mouseenter', evadeButton);
    noBtn.addEventListener('click', evadeButton);
    noBtn.addEventListener('touchstart', evadeButton);
}

function evadeButton(e) {
    e.preventDefault();
    const noBtn = document.getElementById('noBtn');

    noButtonAttempts++;

    // After 2 attempts, disappear!
    if (noButtonAttempts >= 2) {
        noBtn.style.opacity = '0';
        noBtn.style.transform = 'scale(0)';
        setTimeout(() => {
            noBtn.style.display = 'none';
        }, 300);
        return;
    }

    // Get cursor/touch position
    let cursorX, cursorY;
    if (e.type === 'touchstart') {
        cursorX = e.touches[0].clientX;
        cursorY = e.touches[0].clientY;
    } else {
        cursorX = e.clientX;
        cursorY = e.clientY;
    }

    // Get button center
    const rect = noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    // Calculate direction away from cursor
    let dirX = btnCenterX - cursorX;
    let dirY = btnCenterY - cursorY;

    // Normalize and amplify
    const distance = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    const moveDistance = 250 + Math.random() * 150; // Move 250-400px away
    dirX = (dirX / distance) * moveDistance;
    dirY = (dirY / distance) * moveDistance;

    // Calculate new position
    let newX = rect.left + dirX;
    let newY = rect.top + dirY;

    // Keep within viewport bounds
    const padding = 20;
    newX = Math.max(padding, Math.min(window.innerWidth - rect.width - padding, newX));
    newY = Math.max(padding, Math.min(window.innerHeight - rect.height - padding, newY));

    // Apply position
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
}

// ============ Floating Hearts ============

function startFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;

    container.innerHTML = '';

    // Create hearts periodically
    const createHeart = () => {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = ['❤️', '💕', '💗', '💖', '💓'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        container.appendChild(heart);

        // Parse emoji with Twemoji
        if (typeof twemoji !== 'undefined') {
            twemoji.parse(heart, { folder: 'svg', ext: '.svg' });
        }

        // Remove after animation
        setTimeout(() => heart.remove(), 5000);
    };

    // Initial burst of hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 100);
    }

    // Continue creating hearts
    setInterval(createHeart, 300);
}

// ============ Initialize ============

document.addEventListener('DOMContentLoaded', () => {
    // Parse emojis with Twemoji for Apple-style emojis
    if (typeof twemoji !== 'undefined') {
        twemoji.parse(document.body, {
            folder: 'svg',
            ext: '.svg'
        });
    }
    console.log('Valentine Website Loaded! 💕');
});
