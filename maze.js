/**
 * flaw: cheat still works once you hover the start(S) element before game begin,
 * failed if (S) is clicked per lab requirement
 */
var MazeRunner = {
    status: {
        win: 'You win!',
        lose: 'You lose :(',
        default: ''
    },
    stats: {
        win: 0,
        lose: 0,
        crashed: 0,
        cheated: 0
    },
    started: false,
    boundaries: null,
    init: function() {
        var start = document.getElementById('start');

        this.boundaries = document.querySelectorAll('.boundary');

        // save default message for later
        this.status.default = document.getElementById('status').textContent;

        this.boundaries.forEach(function( boundary ) {
            boundary.addEventListener('mouseover', function() {
                if ( !MazeRunner.started )
                    return;
                // yep, straight into the wall
                MazeRunner.stats.crashed++;

                MazeRunner.paintWalls();
            });
        });

        document
            .getElementById('end')
            .addEventListener('mouseover', function() {
                if ( !MazeRunner.started )
                    return;
                if ( MazeRunner.stats.crashed === 0 && MazeRunner.stats.cheated === 0 ) {
                    MazeRunner.updateStatus(MazeRunner.status.win);
                    MazeRunner.stats.win++;
                } else {
                    MazeRunner.updateStatus(MazeRunner.status.lose);
                    MazeRunner.stats.lose++;
                }
            });
        start.addEventListener('click', function() {
            MazeRunner.reset();
            MazeRunner.started = true;

            MazeRunner.onleave();
        });
        start.addEventListener('mouseover', function() {
            MazeRunner.started = true;
            
            //MazeRunner.onleave();
        });
    },
    onleave: function(){
        var maze = document.getElementById('maze');

            // event handler already attached?
            if ( maze.classList.contains('leaveEvent') )
                return;
            maze.addEventListener('mouseleave', function() {
                MazeRunner.stats.cheated++;
                MazeRunner.paintWalls();
                MazeRunner.updateStatus(MazeRunner.status.lose);
            });

            // temp identifier to test if event is already set
            maze.classList.add('leaveEvent');
    },
    updateStatus: function( status ) {
        document.getElementById('status').textContent = status;
    },
    paintWalls: function() {
        
        this.boundaries.forEach(function( wall ) {
            if ( !wall.classList.contains('youlose') )
                wall.classList.add('youlose');
        });
    },
    reset: function() {

        this.stats.win = 0;
        this.stats.lose = 0;
        this.stats.crashed = 0;
        this.stats.cheated = 0;
        this.updateStatus(this.status.default);

        document
            .querySelectorAll('.boundary')
            .forEach(function( wall ) {
                if ( wall.classList.contains('youlose') )
                    wall.classList.remove('youlose');
            });
    }
};

/**
 * onload vs DOMContentLoaded
 * 
 * window.onload fires when every resource -- images, scripts etc -- are fully loaded
 * DOMContentLoaded fires once the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function( e ) {
    console.log('DOM ready..');
    MazeRunner.init();
});