// Point2D class
function Point2D( x, y ) {
    this.x = x;
    this.y = y;
};

// --------------------------------------
Point2D.prototype.add = function( p ) {
    return new Point2D( this.x + p.x, this.y + p.y);
};
// --------------------------------------
Point2D.prototype.sub = function( p ) {
    return new Point2D( this.x - p.x, this.y - p.y);
};
// --------------------------------------
Point2D.prototype.mul = function( f ) {
    return new Point2D( this.x * f, this.y * f );
};
// --------------------------------------
Point2D.prototype.dist = function( p ) {
    return Math.sqrt( sqr( this.x - p.x ) + sqr( this.y - p.y ) );
};
// --------------------------------------
Point2D.prototype.len = function() {
    return Math.sqrt( this.x * this.x + this.y * this.y );
}
// --------------------------------------
Point2D.prototype.limit = function( max_length ) {
    var current_length = this.len();
    if( current_length > max_length )
    {
        this.x *= max_length / current_length;
        this.y *= max_length / current_length;
    }
};
