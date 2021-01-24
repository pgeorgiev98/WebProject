class Scrollbar {
    constructor(orientation) {
        this.orientation = orientation;
        this.max = 50;
        this.thickness = 15;
        this.active = false;
        this.dragStartPos = 0;
    }

    getPositionLength() {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const minLength = 30;

        const verticalCells = Math.ceil(ctx.canvas.height / cellHeight);
        const horizonalCells = Math.ceil(ctx.canvas.width / cellWidth);

        var position = 0;
        var length = 0;
        var max = 0;

        if (this.orientation == 'horizontal') {
            max = this.max + horizonalCells;
            const maxLength = ctx.canvas.width / 2;
            length = Math.max(minLength, maxLength * 50 / max);
            position = Math.min(1, firstColumn / max) * (canvasWidth - this.thickness - length);
        } else {
            max = this.max + verticalCells;
            const maxLength = ctx.canvas.height / 2;
            length = Math.max(minLength, maxLength * 50 / max);
            position = Math.min(1, firstRow / max) * (canvasHeight - this.thickness - length);
        }

        return [position, length, max];
    }

    getNewPosition(coord) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        var plm = this.getPositionLength();
        var length = plm[1];
        var max = plm[2];
        var ret = 0;
        if (this.orientation == 'horizontal') {
            ret = max * coord / (canvasWidth - this.thickness - length);
        } else {
            ret = max * coord / (canvasHeight - this.thickness - length);
        }
        return Math.max(0, Math.round(ret));
    }

    draw() {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        const backColor = '#eeeeee';
        const inactiveColor = '#bbbbbb';
        const activeColor = '#555555';

        const color = this.active ? activeColor : inactiveColor;

        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.orientation == 'horizontal') {
            ctx.fillStyle = backColor;
            ctx.fillRect(0, canvasHeight - this.thickness, canvasWidth - this.thickness, this.thickness);

            ctx.fillStyle = color;
            ctx.fillRect(position, canvasHeight - this.thickness, length, this.thickness);
        } else {
            ctx.fillStyle = backColor;
            ctx.fillRect(canvasWidth - this.thickness, 0, this.thickness, canvasHeight - this.thickness);

            ctx.fillStyle = color;
            ctx.fillRect(canvasWidth - this.thickness, position, this.thickness, length);
        }
    }

    mouseDown(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.orientation == 'horizontal') {
            if (y < ctx.canvas.height - this.thickness)
                return false;
            if (x >= position && x <= position + length) {
                this.dragStartPos = x - position;
                this.active = true;
            }
        } else {
            if (x < ctx.canvas.width - this.thickness)
                return false;
            if (y >= position && y <= position + length) {
                this.dragStartPos = y - position;
                this.active = true;
            }
        }
        return true;
    }

    mouseUp(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.active) {
            if (this.orientation == 'horizontal') {
                firstColumn = this.getNewPosition(x - this.dragStartPos);
            } else {
                firstRow = this.getNewPosition(y - this.dragStartPos);
            }
            this.active = false;
        }
        this.autoSize();
    }

    mouseMove(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.active) {
            if (this.orientation == 'horizontal') {
                firstColumn = this.getNewPosition(x - this.dragStartPos);
            } else {
                firstRow = this.getNewPosition(y - this.dragStartPos);
            }
        }
    }

    autoSize() {
        if (this.orientation == 'horizontal')
            this.max = Math.max(this.max, firstColumn);
        else
            this.max = Math.max(this.max, firstRow);
    }
}

var hScroll = new Scrollbar('horizontal');
var vScroll = new Scrollbar('vertical');