/**
 * Example usage and composition of domage.js functions.
 */

// Don't leak to global scope
(async function(window, d$){

  const content = {
    hipster: [
      'Tattooed JOMO cred, slow-carb kale chips tumeric raw denim put a bird on it.  ' +
      'Slow-carb biodiesel viral, sus cronut +1 letterpress iceland ennui kitsch pop-up ' +
      'pour-over mlkshk.  Kale chips umami swag hot chicken echo park artisan same bitters.  ' +
      '8-bit direct trade beard lo-fi cray pour-over leggings lyft migas synth salvia four ' +
      'loko godard you probably haven\'t heard of them ascot.',

      'Vexillologist pork belly ascot ' +
      'trust fund, franzen knausgaard health goth bruh dreamcatcher bodega boys.  Post-ironic ' +
      'artisan you probably haven\'t heard of them chambray crucifix.  Aesthetic tousled mlkshk ' +
      'plaid bicycle rights godard shoreditch.  Gatekeep butcher unicorn put a bird on it.  ' +
      'Schlitz flexitarian wayfarers gastropub yes plz, coloring book taiyaki man bun hot ' +
      'chicken tonx messenger bag pok pok.  Cold-pressed dreamcatcher yes plz hexagon, four ' +
      'dollar toast gentrify master cleanse.'
    ]
  };

  Object.assign(window.domage, {
    content
  });

})(window, window.domage);