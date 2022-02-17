
function GetAnglePointToPoint(x1, y1, x2, y2) {
	const diffX = Math.abs(x1 - x2);
	const diffY = Math.abs(y1 - y2);
	let a = (Math.atan(diffY / diffX) * 180) / Math.PI;
	if (x1 > x2) {
		a = 180 - a;
	}
	if (y1 > y2) {
		a = -a;
	}
	return a;
}

function getDistPointToPoint(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(Math.abs(y1 - y2), 2) + Math.pow(Math.abs(x1 - x2), 2));
}

function getNextStep(x, y, dist, a) {
	return [x + Math.cos((a * Math.PI) / 180) * dist, y + Math.sin((a * Math.PI) / 180) * dist];
}

function randomMinMax(min, max) {
	const rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

const BREAKPOINTS = {
	full: 1600,
	huge: 1440,
	large: 1300,
	wide: 1160,
	big: 1024,
	middle: 960,
	small: 760,
	xs: 590,
	xxs: 470,
	xxxs: 360,
}

const { BehaviorSubject, Subject } = rxjs
const { filter, first, takeUntil, tap, debounceTime } = rxjs.operators

const zone = new Zone();
currentMedia$ = new BehaviorSubject(Object.keys(BREAKPOINTS).reduce((prev, curr) => {
	prev[curr] = false;
	return prev;
}, {}));
_current$ = new BehaviorSubject(null);

const currentVal = {};
const currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
Object.keys(BREAKPOINTS).forEach(key => {
	currentVal[key] = BREAKPOINTS[key] > currentWidth;
	const point = key;
	window.matchMedia(`screen and (max-width: ${ BREAKPOINTS[key] - 1 }px)`).addListener(mql => {
		zone.run(() => {
			const upd = _current$.value;
			upd[point] = mql.matches;
			_current$.next(upd);
		});
	});
});
_current$.next(currentVal);
_current$.pipe(
	debounceTime(0)
).subscribe(data => {
	currentMedia$.next(data);
});
currentMedia$.next(currentVal);

const speedNormal = 0.2;
const speedFromMouse = 0.6;

class Particle {
	ctx;
	settings;
	canvasWidth;
	canvasHeight;
	radius;
	opacity;
	mouseX$ = new BehaviorSubject(0);
	mouseY$ = new BehaviorSubject(0);
	gridArr = {
		small: [],
		big: [],
	};
	isSmall;
	baseX;
	baseY;
	x;
	y;
	a;
	maxDistMove;
	currentCell;
	defineCurrentBreakpoint;
	speedNormal = speedNormal;
	speedRevert = speedNormal * 2;
	speedFromMouse = speedFromMouse;
	speedFromMouseToBase = speedFromMouse / 2;

	constructor(particlesComponent, isSmall) {
		this.ctx = particlesComponent.ctx;
		this.settings = particlesComponent.settings;
		this.canvasWidth = particlesComponent.canvasWidth;
		this.canvasHeight = particlesComponent.canvasHeight;
		this.mouseX$ = particlesComponent.mouseX$;
		this.mouseY$ = particlesComponent.mouseY$;
		this.isSmall = isSmall;
		this.gridArr = particlesComponent.gridArr;
		this.defineCurrentBreakpoint = particlesComponent.defineCurrentBreakpoint;

		this.speedNormal *= particlesComponent.increase;
		this.speedRevert *= particlesComponent.increase;
		this.speedFromMouse *= particlesComponent.increase;
		this.speedFromMouseToBase *= particlesComponent.increase;

		this.init();
	}

	init() {
		this.radius = this.defineCurrentBreakpoint(this.isSmall ? this.settings.particlesRadiusSmall : this.settings.particlesRadiusBig);
		if (this.isSmall) {
			this.opacity = this.settings.particlesOpacitySmall;
		} else {
			this.opacity = this.settings.particlesOpacityBig;
		}

		if (this.opacity.from !== this.opacity.to) {
			this.opacity = randomMinMax(this.opacity.from * 10, this.opacity.to * 10) / 10;
		} else {
			this.opacity = this.opacity.to;
		}
		const currentGrid = this.isSmall ? this.gridArr.small : this.gridArr.big;
		const currentGridCellIndex = randomMinMax(0, currentGrid.length - 1);
		this.currentCell = currentGrid.splice(currentGridCellIndex, 1)[0];

		let beginX = this.currentCell.x;
		let endX = this.currentCell.x + this.currentCell.w;

		let beginY = this.currentCell.y;
		let endY = this.currentCell.y + this.currentCell.h;

		const gridAccuracyInPercent = this.isSmall ? this.settings.gridAccuracyInPercentSmall : this.settings.gridAccuracyInPercentBig;
		if (gridAccuracyInPercent > 0 && gridAccuracyInPercent < 100) {
			const lengthX = endX - beginX;
			const lengthY = endY - beginY;

			const diffX = gridAccuracyInPercent * lengthX / 200;
			const diffY = gridAccuracyInPercent * lengthY / 200;

			beginX += diffX;
			endX -= diffX;

			beginY += diffY;
			endY -= diffY;
		}

		if (gridAccuracyInPercent === 100) {
			this.baseX = beginX;
			this.baseY = beginY;
		} else {
			this.baseX = randomMinMax(beginX, endX);
			this.baseY = randomMinMax(beginY, endY);
		}

		this.maxDistMove = this.isSmall ? this.settings.particleMaxDistMoveSmall : this.settings.particleMaxDistMoveBig;

		this.a = randomMinMax(-180, 180);
		const pos = getNextStep(this.baseX, this.baseY, this.maxDistMove, this.a);
		this.x = pos[0];
		this.y = pos[1];
	}

	draw() {
		this.updatePosition();

		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		this.ctx.closePath();
		this.ctx.fillStyle = `rgba(${ this.settings.particlesColor.r }, ${ this.settings.particlesColor.g }, ${ this.settings.particlesColor.b }, ${ this.opacity }`;
		this.ctx.fill();
	}

	updatePosition() {
		const distToMouse = getDistPointToPoint(this.mouseX$.value, this.mouseY$.value, this.x, this.y);
		const distToBasePos = getDistPointToPoint(this.x, this.y, this.baseX, this.baseY);

		// РµСЃР»Рё РјС‹С€СЊ РЅРµ РјРµС€Р°РµС‚ РґРІРёР¶РµРЅРёСЋ
		if (distToMouse > this.defineCurrentBreakpoint(this.settings.particleDistToMouse)) {
			// РґРІРёРіР°РµРј С‡Р°СЃС‚РёС†Сѓ РІ СЃР»РµРґСѓСЋС‰СѓСЋ РєРѕРѕСЂРґРёРЅР°С‚Сѓ
			const newPos = getNextStep(this.x, this.y, this.speedNormal, this.a);
			this.x = newPos[0];
			this.y = newPos[1];

			// РµСЃР»Рё С‡Р°СЃС‚РёС†Р° СѓС€Р»Р° РґР°Р»СЊС€Рµ РІРѕР·РјРѕР¶РЅРѕРіРѕ, РґРІРёРіР°РµРј РµС‘ РЅР° РґРІР° С€Р°РіР° РЅР°Р·Р°Рґ
			if (distToBasePos > this.maxDistMove) {
				const pos = getNextStep(this.x, this.y, this.speedRevert, this.a + 180);
				this.x = pos[0];
				this.y = pos[1];

				// СЂРµРЅРґРѕРјРёРј РµС‘ Р±СѓРґСѓС‰РёР№ СѓРіРѕР» РґРІРёР¶РµРЅРёСЏ. РќР° СЃР»РµРґСѓСЋС‰РёР№ fps РѕРЅР° РїРѕР№РґРµС‚ СѓР¶Рµ РїРѕ РЅРµРјСѓ
				this.a = randomMinMax(-180, 180);
			}

			// РµСЃР»Рё РЅР°РґРѕ РѕС‚С‚Р°Р»РєРёРІР°С‚СЊСЃСЏ РѕС‚ РјС‹С€Рё
		} else {
			if (distToBasePos < this.settings.particleMaxDistMoveByMouse) {
				const a = GetAnglePointToPoint(this.mouseX$.value, this.mouseY$.value, this.x, this.y);
				const newPos = getNextStep(this.x, this.y, this.speedFromMouse, a);
				this.x = newPos[0];
				this.y = newPos[1];
			}

			// С‡С‚Рѕ Р±С‹ РґРѕ СЃРѕС‚С‹С… РЅРµ РїСЂРѕСЃС‡РёС‚С‹РІР°РµРј, РѕР±СЂРµР·Р°РµРј РґРѕ 0.1
			if (distToBasePos > 0.1) {
				const a = GetAnglePointToPoint(this.x, this.y, this.baseX, this.baseY);
				const newPos = getNextStep(this.x, this.y, this.speedFromMouseToBase, a);
				this.x = newPos[0];
				this.y = newPos[1];
			}
		}
	}
}

const increasingSettings = ['particlesRadiusSmall', 'particlesRadiusBig', 'particleMaxDistMoveSmall', 'particleMaxDistMoveBig', 'particleDistToMouse', 'particleMaxDistMoveByMouse', 'lineLengthSmall', 'lineLengthBig'];
const increase = 2;
const defaultSettings = {
	particlesColor: {
		r: 117, g: 71, b: 255
	},
	particlesRadiusSmall: [
		{ bp: BREAKPOINTS.huge, st: 3 },
		{ bp: BREAKPOINTS.small, st: 2.5 },
		{ bp: 0, st: 2 },
	],
	particlesRadiusBig: [
		{ bp: BREAKPOINTS.huge, st: 6 },
		{ bp: BREAKPOINTS.small, st: 5 },
		{ bp: 0, st: 4 },
	],

	particlesIntensityInPercentSmall: [{ bp: 0, st: 100 }],
	particlesIntensityInPercentBig: [{ bp: 0, st: 100 }],

	particleMaxDistMoveSmall: 5,
	particleMaxDistMoveBig: 10,
	particleDistToMouse: [
		{ bp: BREAKPOINTS.wide, st: 150 },
		{ bp: BREAKPOINTS.small, st: 100 },
		{ bp: 0, st: 50 },
	],
	particleMaxDistMoveByMouse: 4,

	lineLengthSmall: [
		{ bp: BREAKPOINTS.wide, st: 120 },
		{ bp: BREAKPOINTS.small, st: 100 },
		{ bp: BREAKPOINTS.xs, st: 70 },
		{ bp: 0, st: 50 },
	],
	lineLengthBig: [
		{ bp: BREAKPOINTS.wide, st: 200 },
		{ bp: BREAKPOINTS.small, st: 170 },
		{ bp: BREAKPOINTS.xs, st: 100 },
		{ bp: 0, st: 65 },
	],
	lineColor: {
		r: 117, g: 71, b: 255
	},

	particlesOpacitySmall: { from: 0.2, to: 0.3 },
	particlesOpacityBig: { from: 0.3, to: 0.6 },

	lineOpacitySmall: 0.05,
	lineOpacityBig: 0.15,

	gridCountXSmall: 10,
	gridCountYSmall: 10,
	gridAccuracyInPercentSmall: 0,
	gridCountXBig: 6,
	gridCountYBig: 6,
	gridAccuracyInPercentBig: 30,
};

class ParticlesComponent {
	componentDestroyed$ = new Subject();
	isInitialed = false;

	settings = {
		particlesIntensityInPercentSmall: [
			{ bp: 0, st: 60 },
			{ bp: BREAKPOINTS.small, st: 70 },
			{ bp: BREAKPOINTS.wide, st: 80 }
		],
		excludeGridCellsInRowSmall: [
			{
				bp: BREAKPOINTS.wide,
				st: [
					{ row: 0, cells: [-1] },
					{ row: 1, cells: [-1] },
					{ row: 2, cells: [-1] },
					{ row: 3, cellsDiff: [{ from: 0, to: 6 }] },
					{ row: 4, cellsDiff: [{ from: 0, to: 4 }] },
					{ row: 5, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 6, cells: [0, 9] },
					{ row: 7, cells: [0], cellsDiff: [{ from: 8, to: -1 }] },
					{ row: 8, cells: [0], cellsDiff: [{ from: 6, to: -1 }] },
					{ row: 9, cellsDiff: [{ from: 0, to: 3 }, { from: 5, to: -1 }] },
				]
			},
			{
				bp: BREAKPOINTS.small,
				st: [
					{ row: 0, cells: [-1] },
					{ row: 1, cells: [-1] },
					{ row: 2, cellsDiff: [{ from: 0, to: 5 }] },
					{ row: 3, cellsDiff: [{ from: 0, to: 4 }] },
					{ row: 4, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 5, cells: [0] },
					{ row: 6, cells: [0] },
					{ row: 7, cells: [0, 1, 7] },
					{ row: 8, cellsDiff: [{ from: 0, to: 3 }, { from: 6, to: 7 }] },
					{ row: 9, cells: [-1] },
				]
			},
			{
				bp: 0,
				st: [
					{ row: 0, cells: [-1] },
					{ row: 1, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 2, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 3, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 4, cellsDiff: [{ from: 0, to: 4 }] },
					{ row: 5, cellsDiff: [{ from: 0, to: 4 }] },
					{ row: 6, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 7, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 8, cellsDiff: [{ from: 0, to: 4 }] },
					{ row: 9, cells: [-1] },
				]
			},
		],
		excludeGridCellsInRowBig: [
			{
				bp: BREAKPOINTS.wide,
				st: [
					{ row: 0, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 1, cellsDiff: [{ from: 0, to: 3 }] },
					{ row: 2, cells: [5], cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 3, cells: [0] },
					{ row: 5, cells: [0, 5] },
				]
			},
			{
				bp: BREAKPOINTS.small,
				st: [
					{ row: 0, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 1, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 2, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 3, cells: [0] },
					{ row: 5, cells: [0, 4, 5] },
				]
			},
			{
				bp: 0,
				st: [
					{ row: 0, cells: [0] },
					{ row: 2, cellsDiff: [{ from: 0, to: 2 }] },
					{ row: 3, cellsDiff: [{ from: 0, to: 1 }] },
					{ row: 4, cellsDiff: [{ from: 0, to: 1 }] },
					{ row: 5, cellsDiff: [{ from: 0, to: 1 }] },
				]
			}
		]
	};
	canvasRect;
	ctx;
	gridArr = {
		small: [],
		big: [],
	};
	excludeCellsInRowsSmall = [];
	excludeCellsInColsSmall = [];
	excludeCellsInRowsBig = [];
	excludeCellsInColsBig = [];

	particlesSmallCount;
	particlesBigCount;

	canvasWidth;
	canvasHeight;
	particlesSmall = [];
	particlesBig = [];

	testGridArr = {
		small: [],
		big: [],
	};

	mouseX$ = new BehaviorSubject(0);
	mouseY$ = new BehaviorSubject(0);

	treatedSizes;

	isActive$ = new BehaviorSubject(false);

	animInterval;

	increase = increase;

	lineWidth = 0.5 * this.increase;

	scroll() {
		this.defineRect();
		this.defineIsActive();
	}

	resize() {
		this.defineRect();
		this.defineIsActive();
	}

	mousemove(evt) {
		if (this.isInitialed) {
			this.defineMousePosition(evt);
		}
	}

	constructor(canvas, host, settings) {
		this.hostElem = host
		this.canvas = canvas
		this.ctx = this.canvas.getContext('2d');
    this.settings = settings || this.settings

		this.canvas.style.transform = 'scale(' + 1 / this.increase + ')'
		this.canvas.style.top = 100 / this.increase - 100 + '%'
		this.canvas.style.left = 100 / this.increase - 100 + '%'

		window.addEventListener('scroll', this.scroll.bind(this))
		window.addEventListener('resize', this.resize.bind(this))
		window.addEventListener('mousemove', this.mousemove.bind(this))

		this.readyInit()
	}

	readyInit() {
		this.isActive$.pipe(filter(flag => flag), first()).subscribe(() => this.init());
		this.defineSize();
		this.defineRect();
		this.defineIsActive();
	}

	init() {
		this.initSettings();

		this.isActive$.pipe(takeUntil(this.componentDestroyed$)).subscribe(flag => flag ? this.start() : this.stop());

		this.defineSize();
		this.defineRect();

		currentMedia$.pipe(takeUntil(this.componentDestroyed$)).subscribe(sizes => {
			if (this.treatedSizes !== JSON.stringify(sizes)) {
				this.treatedSizes = JSON.stringify(sizes);

				this.defineSize();

				this.gridArr.small = [];
				this.gridArr.big = [];

				this.testGridArr.small = [];
				this.testGridArr.big = [];

				this.excludeCellsInRowsSmall = [];
				this.excludeCellsInRowsBig = [];
				this.excludeCellsInColsSmall = [];
				this.excludeCellsInColsBig = [];

				this.particlesSmall = [];
				this.particlesBig = [];

				this.initGrid(true);
				this.initGrid(false);

				this.particlesSmallCount = +(this.defineCurrentBreakpoint(this.settings.particlesIntensityInPercentSmall) / 100 * this.gridArr.small.length).toFixed();
				this.particlesBigCount = +(this.defineCurrentBreakpoint(this.settings.particlesIntensityInPercentBig) / 100 * this.gridArr.big.length).toFixed();

				if (!this.testGridBig) {
					for (let i = 0; i < this.particlesSmallCount; i++) {
						this.particlesSmall.push(new Particle(this, true));
					}
				}

				if (!this.testGridSmall) {
					for (let i = 0; i < this.particlesBigCount; i++) {
						this.particlesBig.push(new Particle(this, false));
					}
				}
			}
		});

		this.defineIsActive();

		this.isInitialed = true;
	}

	initSettings() {
		const saveDflSettings = JSON.parse(JSON.stringify(defaultSettings));
		this.settings = JSON.parse(JSON.stringify(this.settings));
		Object.keys(saveDflSettings).forEach(key => {
			if (!this.settings[key]) {
				this.settings[key] = saveDflSettings[key];
			}
		});

		Object.keys(this.settings).forEach(key => {
			if (increasingSettings.includes(key)) {
				if (this.settings[key] instanceof Array) {
					this.settings[key].forEach(s => s.st *= this.increase);
				} else {
					this.settings[key] *= this.increase;
				}
			}
		});
	}

	initGrid(isSmall) {
		const gridArr = isSmall ? this.gridArr.small : this.gridArr.big;
		const testGridArr = isSmall ? this.testGridArr.small : this.testGridArr.big;

		const excludeGridCellsInRow = isSmall ? this.settings.excludeGridCellsInRowSmall : this.settings.excludeGridCellsInRowBig;
		const excludeCellsInRows = isSmall ? this.excludeCellsInRowsSmall : this.excludeCellsInRowsBig;
		const gridCountX = isSmall ? this.settings.gridCountXSmall : this.settings.gridCountXBig;

		const excludeGridCellsInCol = isSmall ? this.settings.excludeGridCellsInColSmall : this.settings.excludeGridCellsInColBig;
		const excludeCellsInCols = isSmall ? this.excludeCellsInColsSmall : this.excludeCellsInColsBig;
		const gridCountY = isSmall ? this.settings.gridCountYSmall : this.settings.gridCountYBig;

		if (excludeGridCellsInRow) {
			const current = this.defineCurrentBreakpoint(excludeGridCellsInRow);
			if (current) {
				current.forEach(item => {
					if (item.cells) {
						item.cells.forEach(cell => {
							if (cell !== -1) {
								excludeCellsInRows.push(`${ item.row }${ cell }`);
							} else {
								for (let i = 0; i < gridCountX; i++) {
									excludeCellsInRows.push(`${ item.row }${ i }`);
								}
							}
						});
					}
					if (item.cellsDiff) {
						item.cellsDiff.forEach(it => {
							for (let i = it.from; i <= (it.to !== -1 ? it.to : gridCountX - 1); i++) {
								excludeCellsInRows.push(`${ item.row }${ i }`);
							}
						});
					}
				});
			}
		}

		if (excludeGridCellsInCol) {
			const current = this.defineCurrentBreakpoint(excludeGridCellsInRow);
			if (current) {
				current.forEach(item => {
					if (item.cells) {
						item.cells.forEach(cell => {
							if (cell !== -1) {
								excludeCellsInCols.push(`${ item.col }${ cell }`);
							} else {
								for (let i = 0; i < gridCountY; i++) {
									excludeCellsInCols.push(`${ item.col }${ i }`);
								}
							}
						});
					}
					if (item.cellsDiff) {
						item.cellsDiff.forEach(it => {
							for (let i = it.from; i <= (it.to !== -1 ? it.to : gridCountY - 1); i++) {
								excludeCellsInRows.push(`${ item.col }${ i }`);
							}
						});
					}
				});
			}
		}

		const widthCell = this.canvasWidth / gridCountX;
		const heightCell = this.canvasHeight / gridCountY;

		for (let ix = 0; ix < gridCountX; ix++) {
			for (let iy = 0; iy < gridCountY; iy++) {
				const idRow = `${ iy }${ ix }`;
				const idCol = `${ ix }${ iy }`;

				const cell = {
					x: ix * widthCell,
					y: iy * heightCell,
					w: widthCell,
					h: heightCell,
					row: iy,
					col: ix,
					idRow,
					idCol
				};

				if (!excludeCellsInRows.includes(idRow) && !excludeCellsInCols.includes(idCol)) {
					gridArr.push(cell);
				}

				if (this.testGridSmall || this.testGridBig) {
					testGridArr.push(cell);
				}
			}
		}
	}

	defineMousePosition(evt) {
		if (this.isActive$.value) {
			this.mouseX$.next((evt.clientX - this.canvasRect.left) * this.increase);
			this.mouseY$.next((evt.clientY - this.canvasRect.top) * this.increase);
		}
	}

	defineSize() {
		this.canvasWidth = this.canvas.width = this.hostElem.clientWidth * this.increase;
		this.canvasHeight = this.canvas.height = this.hostElem.clientHeight * this.increase;
    console.log('this.hostElem', this.hostElem)
    console.log('this.hostElem.clientWidth', this.hostElem.clientWidth)
    console.log('this.hostElem.clientHeight', this.hostElem.clientHeight)
	}

	defineRect() {
		this.canvasRect = this.canvas.getBoundingClientRect();
	}

	drawParticles() {
		this.particlesSmall.forEach(particle => particle.draw());
		this.particlesBig.forEach(particle => particle.draw());
	}

	drawLines(particles) {
		let x1;
		let y1;
		let x2;
		let y2;
		let length;
		let opacity;

		particles.forEach(particleA => {
			particles.forEach(particleB => {
				x1 = particleA.x;
				y1 = particleA.y;
				x2 = particleB.x;
				y2 = particleB.y;

				length = getDistPointToPoint(x1, y1, x2, y2);
				const lineLength = this.defineCurrentBreakpoint(particleA.isSmall ? this.settings.lineLengthSmall : this.settings.lineLengthBig);
				if (length < lineLength) {
					if (particleA.isSmall) {
						opacity = this.settings.lineOpacitySmall;
					} else {
						opacity = this.settings.lineOpacityBig;
					}

					this.ctx.beginPath();
					this.ctx.lineWidth = this.lineWidth;
					this.ctx.strokeStyle = `rgba(${ this.settings.lineColor.r }, ${ this.settings.lineColor.g }, ${ this.settings.lineColor.b }, ${ opacity }`;
					this.ctx.moveTo(x1, y1);
					this.ctx.lineTo(x2, y2);
					this.ctx.closePath();
					this.ctx.stroke();
				}
			});
		});
	}

	start() {
		this.stop();
		this.animInterval = setInterval(() => {
			this.clearAll();
			this.drawLines(this.particlesSmall);
			this.drawLines(this.particlesBig);
			this.drawParticles();
			this.drawTestGrid();
		}, 30);
	}

	stop() {
		clearInterval(this.animInterval);
	}

	drawTestGrid() {
		if (this.testGridSmall || this.testGridBig) {
			for (let n = 0; n < 2; n++) {
				const arr = n === 0 ? this.testGridArr.small : this.testGridArr.big;
				const excludeCellsInRows = n === 0 ? this.excludeCellsInRowsSmall : this.excludeCellsInRowsBig;
				const excludeCellsInCols = n === 0 ? this.excludeCellsInColsSmall : this.excludeCellsInColsBig;

				if ((n === 0 && this.testGridSmall) || (n === 1 && this.testGridBig)) {
					arr.forEach(cell => {
						this.ctx.beginPath();
						this.ctx.rect(cell.x, cell.y, cell.w, cell.h);
						this.ctx.lineWidth = 1;
						this.ctx.strokeStyle = n === 0 ? '#0022ff' : '#ff5270';
						this.ctx.stroke();

						if (excludeCellsInRows.includes(cell.idRow) || excludeCellsInCols.includes(cell.idCol)) {
							this.ctx.fillStyle = 'rgba(0, 0, 0, .2)';
							this.ctx.fill();
						}

						this.ctx.beginPath();
						this.ctx.font = '500 16px Arial';
						this.ctx.fillStyle = '#000';
						this.ctx.fillText(`row: ${ cell.row }`, cell.x + 5, cell.y + cell.h / 2);
						this.ctx.fillText(`col: ${ cell.col }`, cell.x + cell.w / 2 - 20, cell.y + 15);
					});
				}
			}
		}
	}

	clearAll() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}

	defineIsActive() {
		const flag = ((this.canvasRect.top >= 0 && this.canvasRect.top < innerHeight) || this.canvasRect.top < 0) && this.canvasRect.bottom > 0;
		this.setIsActive(flag);
	}

	setIsActive(flag) {
		if (flag !== this.isActive$.value || !this.isInitialed) {
			this.isActive$.next(flag);
		}
	}

	defineCurrentBreakpoint(map) {
		let currentBreakpoint = 0;
		let current = null;

		if (map && map[0] && map[0].bp >= 0) {
			map.forEach(item => {
				if (innerWidth - item.bp >= 0 && item.bp >= currentBreakpoint) {
					currentBreakpoint = item.bp;
					current = item.st;
				}
			});
		}

		return current;
	}
}
