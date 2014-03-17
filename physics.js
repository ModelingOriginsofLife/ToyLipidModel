function recomputeAccelerations()
{
    for( var i = 0; i < N_ATOMS; ++i )
    {
        atoms[i].acceleration.x = 0.0;
        atoms[i].acceleration.y = 0.0;
    }

    for( var i = 0; i < N_ATOMS; ++i )
    {
        for( var j = i+1; j < N_ATOMS; ++j )
        {
            var to = atoms[i].position.sub( atoms[j].position );
            var d = to.len();

            // apply spring forces between this pair of atoms if bonded
            if( atoms[i].hasBondWith( atoms[j] ) )
            {
                var f = spring_force( SPRING_FORCE_RANGE, d, SPRING_FORCE_MAGNITUDE );
                var force = to.mul( f );
                atoms[i].acceleration = atoms[i].acceleration.sub( force );
                atoms[j].acceleration = atoms[j].acceleration.add( force );
            }

            // they can react
            if( d < REACTION_RANGE )
            {      
                if( atoms[i].type == NEUTRAL && atoms[j].type == NEUTRAL )
                {
                    atoms[i].type = HYDROPHOBIC;
                    atoms[j].type = HYDROPHILIC;
                    atoms[i].bondTo( atoms[j] );
                }
            }

            // apply repulsion forces between this pair of atoms
            if( d < STRONG_FORCE_RANGE )
            {    
                if( (atoms[i].type == WATER && atoms[j].type == HYDROPHOBIC) ||
                    (atoms[i].type == HYDROPHOBIC && atoms[j].type == WATER) ||
                    (atoms[i].type == HYDROPHILIC && atoms[j].type == HYDROPHOBIC) ||
                    (atoms[i].type == HYDROPHOBIC && atoms[j].type == HYDROPHILIC) )
                {
                    // strong repulsion
                    f = repulsion_force( STRONG_FORCE_RANGE, d, STRONG_FORCE_MAGNITUDE );
                }
                else if( atoms[i].type == atoms[j].type )
                {
                    // medium repulsion
                    f = repulsion_force( MEDIUM_FORCE_RANGE, d, MEDIUM_FORCE_MAGNITUDE );
                }
                else 
                {
                    // low repulsion
                    f = repulsion_force( WEAK_FORCE_RANGE, d, WEAK_FORCE_MAGNITUDE );
                }
                force = to.mul( f );
                atoms[i].acceleration = atoms[i].acceleration.add( force );
                atoms[j].acceleration = atoms[j].acceleration.sub( force );
            }
        }

        // atoms are repelled by the walls
        for( var wall_test = 0; wall_test < 4; ++wall_test )
        {
            // pretend there's a water atom at the nearby wall, repelling us
            switch(wall_test) 
            {
                default:
                case 0: var wall = new Point2D( 0, atoms[i].position.y ); break;
                case 1: var wall = new Point2D( canvas.width, atoms[i].position.y ); break;
                case 2: var wall = new Point2D( atoms[i].position.x, 0 ); break;
                case 3: var wall = new Point2D( atoms[i].position.x, canvas.height ); break;
            }
            var to = atoms[i].position.sub( wall );
            switch( atoms[i].type ) 
            {
                case WATER: f = repulsion_force( WEAK_FORCE_RANGE, to.len(), WEAK_FORCE_MAGNITUDE ); break;
                default: f = repulsion_force( STRONG_FORCE_RANGE, to.len(), STRONG_FORCE_MAGNITUDE ); break;
            }
            atoms[i].acceleration = atoms[i].acceleration.add( to.mul( f ) );
        }
    }
}

function recomputeVelocities()
{
    for( var i = 0; i < N_ATOMS; ++i )
    {
        atoms[i].velocity = atoms[i].velocity.add( atoms[i].acceleration );
        atoms[i].velocity.limit( MAX_SPEED );
    }
}

function recomputePositions()
{
    for( var i = 0; i < N_ATOMS; ++i )
    {
        atoms[i].position = atoms[i].position.add( atoms[i].velocity );
        if( atoms[i].position.x < 0) 
            atoms[i].position.x = WEAK_FORCE_RANGE;
        if( atoms[i].position.x > canvas.width) 
            atoms[i].position.x = canvas.width - WEAK_FORCE_RANGE;
        if( atoms[i].position.y < 0) 
            atoms[i].position.y = WEAK_FORCE_RANGE;
        if( atoms[i].position.y > canvas.height) 
            atoms[i].position.y = canvas.height - WEAK_FORCE_RANGE;
    }
}

function repulsion_force( range, d, magnitude )
{
    d = Math.max( d, 0.1 );
    if( d < range )
        return magnitude * ( range / d - 1.0 );
    else
        return 0.0;
}

function spring_force( range, d, magnitude )
{
    if( d > range )
        return magnitude * ( d / range - 1.0 );
    else
        return 0.0;
}
