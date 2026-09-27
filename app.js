(function() {
    const PITCH_RATIO = 68 / 105;

    const state = {
        showOpponent: true,
        homeFormation: '4-3-3',
        awayFormation: '4-3-3',
        activeTool: 'select',
        activeColor: '#ffffff',
        players: [],
        drawings: [],
        draggedPlayer: null,
        selectedPlayerForEdit: null,
        isDrawing: false,
        currentPath: [],
        animationFrame: null
    };

    const FORMATIONS = {
        '4-3-3': {
            half: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.78 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.78 },
                { r: 'CM', x: 0.25, y: 0.67 }, { r: 'CDM', x: 0.50, y: 0.72 }, { r: 'CM', x: 0.75, y: 0.67 },
                { r: 'LW', x: 0.18, y: 0.55 }, { r: 'ST', x: 0.50, y: 0.54 }, { r: 'RW', x: 0.82, y: 0.55 }
            ],
            full: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.75 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.75 },
                { r: 'CM', x: 0.22, y: 0.52 }, { r: 'CDM', x: 0.50, y: 0.62 }, { r: 'CM', x: 0.78, y: 0.52 },
                { r: 'LW', x: 0.15, y: 0.22 }, { r: 'ST', x: 0.50, y: 0.18 }, { r: 'RW', x: 0.85, y: 0.22 }
            ]
        },
        '4-2-3-1': {
            half: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.78 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.78 },
                { r: 'DM', x: 0.35, y: 0.71 }, { r: 'DM', x: 0.65, y: 0.71 },
                { r: 'LAM', x: 0.20, y: 0.60 }, { r: 'CAM', x: 0.50, y: 0.61 }, { r: 'RAM', x: 0.80, y: 0.60 },
                { r: 'ST', x: 0.50, y: 0.53 }
            ],
            full: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.75 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.75 },
                { r: 'DM', x: 0.32, y: 0.58 }, { r: 'DM', x: 0.68, y: 0.58 },
                { r: 'LAM', x: 0.18, y: 0.32 }, { r: 'CAM', x: 0.50, y: 0.35 }, { r: 'RAM', x: 0.82, y: 0.32 },
                { r: 'ST', x: 0.50, y: 0.15 }
            ]
        },
        '4-4-2': {
            half: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.78 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.78 },
                { r: 'LM', x: 0.15, y: 0.63 }, { r: 'CM', x: 0.38, y: 0.66 }, { r: 'CM', x: 0.62, y: 0.66 }, { r: 'RM', x: 0.85, y: 0.63 },
                { r: 'ST', x: 0.35, y: 0.53 }, { r: 'ST', x: 0.65, y: 0.53 }
            ],
            full: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'LB', x: 0.12, y: 0.75 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.75 },
                { r: 'LM', x: 0.15, y: 0.45 }, { r: 'CM', x: 0.38, y: 0.52 }, { r: 'CM', x: 0.62, y: 0.52 }, { r: 'RM', x: 0.85, y: 0.45 },
                { r: 'ST', x: 0.35, y: 0.18 }, { r: 'ST', x: 0.65, y: 0.18 }
            ]
        },
        '3-5-2' : {
            half: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'CB', x: 0.25, y: 0.83 }, { r: 'CB', x: 0.50, y: 0.85 }, { r: 'CB', x: 0.75, y: 0.83 },
                { r: 'LWB', x: 0.10, y: 0.65 }, { r: 'CM', x: 0.33, y: 0.68 }, { r: 'CDM', x: 0.50, y: 0.73 }, { r: 'CM', x: 0.67, y: 0.68 }, { r: 'RWB', x: 0.90, y: 0.65 },
                { r: 'ST', x: 0.35, y: 0.53 }, { r: 'ST', x: 0.65, y: 0.53 }
            ],
            full: [
                { r: 'GK', x: 0.50, y: 0.93, gk: true },
                { r: 'CB', x: 0.25, y: 0.83 }, { r: 'CB', x: 0.50, y: 0.85 }, { r: 'CB', x: 0.75, y: 0.83 },
                { r: 'LWB', x: 0.10, y: 0.48 }, { r: 'CM', x: 0.32, y: 0.55 }, { r: 'CDM', x: 0.50, y: 0.66 }, { r: 'CM', x: 0.68, y: 0.55 }, { r: 'RWB', x: 0.90, y: 0.48 },
                { r: 'ST', x: 0.35, y: 0.18 }, { r: 'ST', x: 0.65, y: 0.18 }
            ]
        },
        '4-1-4-1': {
        half: [
            { r: 'GK', x: 0.50, y: 0.93, gk: true },
            { r: 'LB', x: 0.12, y: 0.78 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.78 },
            { r: 'CDM', x: 0.50, y: 0.73 },
            { r: 'LM', x: 0.15, y: 0.62 }, { r: 'CM', x: 0.38, y: 0.64 }, { r: 'CM', x: 0.62, y: 0.64 }, { r: 'RM', x: 0.85, y: 0.62 },
            { r: 'ST', x: 0.50, y: 0.53 }
        ],
        full: [
            { r: 'GK', x: 0.50, y: 0.93, gk: true },
            { r: 'LB', x: 0.12, y: 0.75 }, { r: 'CB', x: 0.36, y: 0.84 }, { r: 'CB', x: 0.64, y: 0.84 }, { r: 'RB', x: 0.88, y: 0.75 },
            { r: 'CDM', x: 0.50, y: 0.66 },
            { r: 'LM', x: 0.15, y: 0.45 }, { r: 'CM', x: 0.38, y: 0.50 }, { r: 'CM', x: 0.62, y: 0.50 }, { r: 'RM', x: 0.85, y: 0.45 },
            { r: 'ST', x: 0.50, y: 0.18 }
        ]
        },
        '5-3-2': {
        half: [
            { r: 'GK', x: 0.50, y: 0.93, gk: true },
            { r: 'LWB', x: 0.12, y: 0.74 },
            { r: 'CB', x: 0.32, y: 0.84 },
            { r: 'CB', x: 0.50, y: 0.85 },
            { r: 'CB', x: 0.68, y: 0.84 },
            { r: 'RWB', x: 0.88, y: 0.74 },
            { r: 'CM', x: 0.30, y: 0.67 },
            { r: 'CDM', x: 0.50, y: 0.72 },
            { r: 'CM', x: 0.70, y: 0.67 },
            { r: 'ST', x: 0.38, y: 0.54 },
            { r: 'ST', x: 0.62, y: 0.54 }
        ],
        full: [
            { r: 'GK', x: 0.50, y: 0.93, gk: true },
            { r: 'LWB', x: 0.10, y: 0.58 },
            { r: 'CB', x: 0.30, y: 0.82 },
            { r: 'CB', x: 0.50, y: 0.84 },
            { r: 'CB', x: 0.70, y: 0.82 },
            { r: 'RWB', x: 0.90, y: 0.58 },
            { r: 'CM', x: 0.32, y: 0.50 },
            { r: 'CDM', x: 0.50, y: 0.62 },
            { r: 'CM', x: 0.68, y: 0.50 },
            { r: 'ST', x: 0.38, y: 0.18 },
            { r: 'ST', x: 0.62, y: 0.18 }
        ]
        }
    };

    const canvas = document.getElementById('pitchCanvas');
    const ctx = canvas.getContext('2d');

    function init() {
        setupCanvasDimensions();
        buildTeamPlayers();
        bindEvents();
        triggerSmoothTransition();
    }

    function setupCanvasDimensions() {
        const workspace = document.querySelector('.workspace');
        const maxWidth = workspace.clientWidth - 30;
        const maxHeight = workspace.clientHeight - 30;

        let width = maxWidth;
        let height = width * PITCH_RATIO;

        if (height > maxHeight){
            height = maxHeight;
            width = height / PITCH_RATIO;
        }

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(dpr, dpr);
    }

    function buildTeamPlayers(){
        state.players = [];

        const homeCoords = FORMATIONS[state.homeFormation][state.showOpponent ? 'half' : 'full'];
        homeCoords.forEach((p, idx) => {
            state.players.push({
                id: `home_${idx}`,
                team: 'home',
                number: idx === 0 ? '1' : `${idx + 1}`,
                name: p.r,
                x: p.x,
                y: p.y,
                targetX: p.x,
                targetY: p.y,
                isGK: !!p.gk
            });
        });
    
        if (state.showOpponent){
            const awayCoords = FORMATIONS[state.awayFormation]['half'];
            awayCoords.forEach((p, idx) => {
                state.players.push({
                    id: `away_${idx}`,
                    team: 'away',
                    number: idx === 0 ? '1' : `${idx + 1}`,
                    name: p.r,
                    x: p.x,
                    y: 1 - p.y,
                    targetX: p.x,
                    targetY: 1 - p.y,
                    isGK: !!p.gk
                });
            });
        }

        state.players.push({
            id: 'ball',
            team: 'ball',
            number: '',
            name: 'BALL',
            x: 0.5,
            y: 0.5,
            targetX: 0.5,
            targetY: 0.5
        });
    }

    function animatePlayersToTargets() {
        let needsAnim = false;
        state.players.forEach(p => {
            if (p.targetX !== undefined && p.targetY !== undefined){
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;
                if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
                    p.x += dx * 0.1;
                    p.y += dy * 0.1;
                    needsAnim = true;
                } else {
                    p.x = p.targetX;
                    p.y = p.targetY;
                }
            }
        });

        render();

        if (needsAnim) {
            state.animationFrame = requestAnimationFrame(animatePlayersToTargets);
        }
    }

    function triggerSmoothTransition() {
        if (state.animationFrame) cancelAnimationFrame(state.animationFrame);

        const homeCoords = FORMATIONS[state.homeFormation][state.showOpponent ? 'half' : 'full'];
        let homeIdx = 0;

        state.players.forEach(p => {
            if (p.team === 'home') {
                if (homeCoords[homeIdx]) {
                    p.targetX = homeCoords[homeIdx].x;
                    p.targetY = homeCoords[homeIdx].y;
                }
                homeIdx++;
            }
        });

        if (state.showOpponent) {
            const awayCoords = FORMATIONS[state.awayFormation]['half'];
            let awayIdx = 0;
            state.players.forEach(p => {
                if (p.team === 'away') {
                    if (awayCoords[awayIdx]) {
                        p.targetX = awayCoords[awayIdx].x;
                        p.targetY = 1 - awayCoords[awayIdx].y;
                    }
                    awayIdx++;
                }
            });
        }
        animatePlayersToTargets();
    }

    function render() {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);

        ctx.clearRect(0, 0, w, h);

        drawPitch(w, h);
        drawTacticalDrawings(w, h);
        drawPlayers(w, h);
    }

    function drawPitch(w, h) {
        ctx.fillStyle = '#1a472a';
        ctx.fillRect(0, 0, w, h);

        const numStripes = 10;
        const stripeWidth = w / numStripes;
        ctx.fillStyle = '#153e24';
        for (let i = 0; i < numStripes; i += 2) {
            ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';

        const pad = 15;
        const pw = w - (pad * 2);
        const ph = h - (pad * 2);

        ctx.strokeRect(pad, pad, pw, ph);

        ctx.beginPath();
        ctx.moveTo(pad, h / 2);
        ctx.lineTo(w - pad, h / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, ph * 0.14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
        ctx.fill();

        const drawPenaltyArea = (isTop) => {
            const boxW = pw * 0.44;
            const boxH = ph * 0.18;
            const boxX = (w - boxW) / 2;
            const boxY = isTop ? pad : h - pad - boxH;

            ctx.strokeRect(boxX, boxY, boxW, boxH);

            const sixW = pw * 0.20;
            const sixH = ph * 0.06;
            const sixX = (w - sixW) / 2;
            const sixY = isTop ? pad : h - pad - sixH;
            ctx.strokeRect(sixX, sixY, sixW, sixH);

            const spotY = isTop ? pad + (ph * 0.12) : h - pad - (ph * 0.12);
            ctx.beginPath();
            ctx.arc(w / 2, spotY, 2.5, 0, Math.PI * 2);
            ctx.fill();

            const startAngle = isTop ? 0.2 * Math.PI : 1.2 * Math.PI;
            const endAngle = isTop ? 0.8 * Math.PI : 1.8 * Math.PI;
            ctx.beginPath();
            ctx.arc(w / 2, spotY, ph * 0.12, startAngle, endAngle);
            ctx.stroke();
        };

        drawPenaltyArea(true);
        drawPenaltyArea(false);
    }

    function drawTacticalDrawings(w, h) {
        state.drawings.forEach(d => {
            ctx.strokeStyle = d.color;
            ctx.fillStyle = d.color;
            ctx.lineWidth = d.type === 'pass' ? 2 : 3;

            if (d.type === 'pass') {
                ctx.setLineDash([6, 6]);
            } else {
                ctx.setLineDash([]);
            }

            if (d.type === 'area' && d.points.length >= 2) {
                const p1 = d.points[0];
                const p2 = d.points[d.points.length - 1];
                ctx.fillStyle = d.color.replace(')', ', 0.2)').replace('rgb', 'rgba');
                ctx.fillRect(p1.x * w, p1.y * h, (p2.x - p1.x) * w, (p2.y - p1.y) * h);
                ctx.strokeRect(p1.x * w, p1.y * h, (p2.x - p1.x) * w, (p2.y - p1.y) * h);
                return;
            }

            ctx.beginPath();
            d.points.forEach((pt, i) => {
                const px = pt.x * w;
                const py = pt.y * h;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();

            if ((d.type === 'arrow' || d.type === 'pass' || d.type === 'dribble') && d.points.length >= 2) {
                const pLast = d.points[d.points.length - 1];
                const pPrev = d.points[d.points.length - 2];
                const angle = Math.atan2((pLast.y - pPrev.y) * h, (pLast.x - pPrev.x) * w);

                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(pLast.x * w, pLast.y * h);
                ctx.lineTo(
                    pLast.x * w - 10 * Math.cos(angle - Math.PI / 6),
                    pLast.y * h - 10 * Math.sin(angle - Math.PI / 6)
                );
                ctx.lineTo(
                    pLast.x * w - 10 * Math.cos(angle + Math.PI / 6),
                    pLast.y * h - 10 * Math.sin(angle + Math.PI / 6)
                );
                ctx.closePath();
                ctx.fill();
            }
        });
    }

    function drawPlayers(w, h) {
        const radius = Math.min(w, h) * 0.026;

        state.players.forEach(p => {
            const px = p.x * w;
            const py = p.y * h;

            if (p.team === 'ball') {
                ctx.save();
                ctx.beginPath();
                ctx.arc(px, py, radius * 0.65, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(px, py, radius * 0.25, 0, Math.PI * 2);
                ctx.fillStyle = '#000000';
                ctx.fill();
                ctx.restore();
                return;
            }

            ctx.save();
            ctx.beginPath();
            ctx.arc(px + 2, py + 2, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(px, py, radius, 0, Math.PI * 2);

            if (p.isGK) {
                ctx.fillStyle = '#eab308';
            } else if (p.team === 'home') {
                ctx.fillStyle = '#0284c7';
            } else {
                ctx.fillStyle = '#dc2626';
            }
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${radius * 0.9}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.number, px, py + 1);

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${radius * 0.65}px Inter`;
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 3;
            ctx.fillText(p.name, px, py + radius + 10);

            ctx.restore();
        });
    }

    function getEventRatioCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
        };
    }

    function findHitPlayer(coords) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        const radius = Math.min(w, h) * 0.035;

        return state.players.find(p => {
            const dist = Math.hypot((p.x - coords.x) * w, (p.y - coords.y) * h);
            return dist <= radius;
        });
    }

        function setupCustomSelect(root, onChange) {
        if (!root) return;
        const trigger = root.querySelector('.custom-select-trigger');
        const options = root.querySelectorAll('.custom-select-option');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-select.open').forEach(sel => {
                if (sel !== root) sel.classList.remove('open');
            });
            root.classList.toggle('open');
        });

        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = opt.dataset.value;
                setCustomSelectValue(root, value);
                root.classList.remove('open');
                onChange(value);
            });
        });
    }

    function setCustomSelectValue(root, value) {
        if (!root) return;
        const trigger = root.querySelector('.custom-select-trigger');
        const options = root.querySelectorAll('.custom-select-option');
        let matched = false;

        options.forEach(opt => {
            const isMatch = opt.dataset.value === value;
            opt.classList.toggle('selected', isMatch);
            if (isMatch) matched = true;
        });

        if (matched) {
            root.dataset.value = value;
            trigger.textContent = value;
        }
    }


    function bindEvents() {
        window.addEventListener('resize', () => {
            setupCanvasDimensions();
            render();
        });

        document.getElementById('btnVSOn').addEventListener('click', function() {
            if (state.showOpponent) return;
            state.showOpponent = true;
            this.classList.add('active');
            document.getElementById('btnVSOff').classList.remove('active');
            const awayWrapper = document.getElementById('awayFormationWrapper');
            if (awayWrapper) awayWrapper.style.display = 'block';
            buildTeamPlayers();
            triggerSmoothTransition();
        });

        document.getElementById('btnVSOff').addEventListener('click', function() {
            if (!state.showOpponent) return;
            state.showOpponent = false;
            this.classList.add('active');
            document.getElementById('btnVSOn').classList.remove('active');
            const awayWrapper = document.getElementById('awayFormationWrapper');
            if (awayWrapper) awayWrapper.style.display = 'none';
            buildTeamPlayers();
            triggerSmoothTransition();
        });

           const homeSelectEl = document.getElementById('selectHomeFormation');
const awaySelectEl = document.getElementById('selectAwayFormation');

setupCustomSelect(homeSelectEl, (value) => {
    state.homeFormation = value;
    triggerSmoothTransition();
});

setupCustomSelect(awaySelectEl, (value) => {
    state.awayFormation = value;
    triggerSmoothTransition();
});

setCustomSelectValue(homeSelectEl, state.homeFormation);
setCustomSelectValue(awaySelectEl, state.awayFormation);

document.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select.open').forEach(sel => {
        if (!sel.contains(e.target)) sel.classList.remove('open');
    });
});

        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                state.activeTool = this.dataset.tool;
            });
        });

        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', function() {
                document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                this.classList.add('active');
                state.activeColor = this.dataset.color;
            });
        });

        const handlePointerDown = (e) => {
            const coords = getEventRatioCoords(e);

            if (state.activeTool === 'select') {
                const hit = findHitPlayer(coords);
                if (hit) {
                    state.draggedPlayer = hit;
                }
            } else if (state.activeTool === 'eraser') {
                state.drawings = state.drawings.filter(d => {
                    return !d.points.some(pt => Math.hypot(pt.x - coords.x, pt.y - coords.y) < 0.04);
                });
                render();
            } else {
                state.isDrawing = true;
                state.currentPath = [{ x: coords.x, y: coords.y }];
            }
        };

        const handlePointerMove = (e) => {
            const coords = getEventRatioCoords(e);

            if (state.draggedPlayer) {
                state.draggedPlayer.x = coords.x;
                state.draggedPlayer.y = coords.y;
                state.draggedPlayer.targetX = coords.x;
                state.draggedPlayer.targetY = coords.y;
                render();
            } else if (state.isDrawing) {
                state.currentPath.push({ x: coords.x, y: coords.y });
                
                render();
                const w = canvas.width / (window.devicePixelRatio || 1);
                const h = canvas.height / (window.devicePixelRatio || 1);
                
                ctx.strokeStyle = state.activeColor;
                ctx.lineWidth = 3;
                ctx.beginPath();
                state.currentPath.forEach((pt, i) => {
                    if (i === 0) ctx.moveTo(pt.x * w, pt.y * h);
                    else ctx.lineTo(pt.x * w, pt.y * h);
                });
                ctx.stroke();
            }
        };

        const handlePointerUp = () => {
            if (state.draggedPlayer) {
                state.draggedPlayer = null;
            } else if (state.isDrawing) {
                state.isDrawing = false;
                if (state.currentPath.length > 1) {
                    state.drawings.push({
                        type: state.activeTool,
                        color: state.activeColor,
                        points: [...state.currentPath]
                    });
                }
                state.currentPath = [];
                render();
            }
        };

        canvas.addEventListener('mousedown', handlePointerDown);
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);

        canvas.addEventListener('touchstart', (e) => { handlePointerDown(e); e.preventDefault(); });
        window.addEventListener('touchmove', handlePointerMove);
        window.addEventListener('touchend', handlePointerUp);

        canvas.addEventListener('dblclick', (e) => {
            const coords = getEventRatioCoords(e);
            const hit = findHitPlayer(coords);
            if (hit && hit.team !== 'ball') {
                state.selectedPlayerForEdit = hit;
                document.getElementById('modalPlayerNumber').value = hit.number;
                document.getElementById('modalPlayerName').value = hit.name;
                document.getElementById('playerModal').style.display = 'flex';
            }
        });

        document.getElementById('btnSaveModal').addEventListener('click', () => {
            if (state.selectedPlayerForEdit) {
                state.selectedPlayerForEdit.number = document.getElementById('modalPlayerNumber').value;
                state.selectedPlayerForEdit.name = document.getElementById('modalPlayerName').value;
                render();
            }
            document.getElementById('playerModal').style.display = 'none';
        });

        document.getElementById('btnCancelModal').addEventListener('click', () => {
            document.getElementById('playerModal').style.display = 'none';
        });

        document.getElementById('btnClearDrawings').addEventListener('click', () => {
            state.drawings = [];
            render();
        });

        document.getElementById('btnResetAll').addEventListener('click', () => {
            state.drawings = [];
            buildTeamPlayers();
            triggerSmoothTransition();
        });

        document.getElementById('btnExport').addEventListener('click', () => {
            const exportCanvas = document.createElement('canvas');
            const eCtx = exportCanvas.getContext('2d');
            
            const notes = document.getElementById('tacticalNotes').value;
            const notesHeaderHeight = notes ? 80 : 0;

            exportCanvas.width = canvas.width;
            exportCanvas.height = canvas.height + (notesHeaderHeight * (window.devicePixelRatio || 1));

            eCtx.fillStyle = '#0f172a';
            eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

            eCtx.drawImage(canvas, 0, 0);

            if (notes) {
                const h = canvas.height;
                eCtx.fillStyle = '#1e293b';
                eCtx.fillRect(0, h, exportCanvas.width, notesHeaderHeight * (window.devicePixelRatio || 1));

                eCtx.fillStyle = '#38bdf8';
                eCtx.font = 'bold 18px Inter';
                eCtx.fillText('Tactical Notes:', 20, h + 30);

                eCtx.fillStyle = '#ffffff';
                eCtx.font = '16px Inter';
                eCtx.fillText(notes, 20, h + 60);
            }

            const link = document.createElement('a');
            link.download = `Tactical_Board_${new Date().toISOString().slice(0, 10)}.png`;
            link.href = exportCanvas.toDataURL('image/png');
            link.click();
        });
    }

    window.onload = init;
})();