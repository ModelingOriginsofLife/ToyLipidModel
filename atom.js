function Atom( t ) 
{
    this.position     = new Point2D( Math.random() * canvas.width,Math.random() * canvas.height );
    this.velocity     = new Point2D( Math.random() * 6.0 - 3.0, Math.random() * 6.0 - 3.0 );
    this.acceleration = new Point2D( 0, 0 );
    this.type = t;
    this.bonds = new Array();
}

Atom.prototype.bondTo = function( a ) 
{
    this.bonds.push( a );
    a.bonds.push( this );
}

Atom.prototype.hasBondWith = function( a )
{
    return this.bonds.indexOf( a ) > -1;
}

Atom.prototype.drawAtom = function( context )
{
    // draw circles for the atoms
    switch( this.type ) 
    {
        case WATER:       context.fillStyle = "rgb(0,0,255)"; break;
        case HYDROPHOBIC: context.fillStyle = "rgb(255,0,0)"; break;
        case HYDROPHILIC: context.fillStyle = "rgb(0,255,0)"; break;
        default:          context.fillStyle = "rgb(255,0,255)"; break;
    }
    context.beginPath();
    context.arc( this.position.x, this.position.y, R, 0, 2*Math.PI );
    context.fill();
    context.closePath();
    
    // draw lines for the bonds
    context.fillStyle = "rgb(0,0,0)";
    context.beginPath();
    for( var i = 0; i < this.bonds.length; ++i )
    {
        context.moveTo( this.position.x, this.position.y );
        context.lineTo( this.bonds[ i ].position.x, this.bonds[ i ].position.y );
    }
    context.stroke();
    context.closePath();
}
