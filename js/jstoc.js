/*
 * Dynamic Table of Contents script
 * by Steve Wattam <http://stephenwattam.com>,
 * based on the algorithm by
 * Matt Whitlock <http://www.whitsoftdev.com/>
 */
function generateTOC(toc, parnt) {

  // Min, max levels of heading to notice (inclusive)
  var toclim  = [2,2],                // limits for TOC (NB: h1=0, h2=1, etc..)
      headlim = [2,2],                // limits for headings

      // Display options
      heading_nums  = false,           // Display leading numbers in headings?
      link_nums     = true,           // Display leading numbers in TOC?

      // Counters
      rx        = /^h([2-3])$/i,      // Regex for matching headers
      levels    = [0, 0, 0, 0, 0, 0], // TOC depth counters
      container = "ul",               // Type of container to use
      hrefid    = "section";          // What to call links

  // Correct for off-by-one error on the limits.
  // This is totally unnecessary but makes config easier and only costs
  // a few cycles (it's cheaper than modifying the code below).
  toclim[0]--; toclim[1]--; headlim[0]--; headlim[1]--;

  // Create the TOC container
  toc = toc.appendChild(document.createElement(container));

  // Parent is body unless given
  if(!parnt) parnt = document.body;



  // Recursively get linear list of child nodes
  function getChildren(parnt){
    // Always return parent
    var list = [parnt];
    
    // Convert from nodelist to array
    var children = Array.prototype.slice.call(parnt.children);
    for(var i=0; i<children.length; i++)
      list = list.concat( getChildren( children[i] ));
    return list;
  };


  // Loop over all heading
  var children = getChildren(parnt);
  for(var i=0; i<children.length; i++){

    // Load next node
    var node = children[i];

    // If it's a heading...
    if (m = node.nodeName.match(rx)){

      // get level
      lv = m[1] - 1;
      levels[lv] ++;

      // build section id for later use
      var section = levels[toclim[0]];
      for( var j=toclim[0]+1; j<=lv; j++ ) section += "." + levels[j];

      // If this is worthy of going in the TOC...
      if(lv >= toclim[0] && lv <= toclim[1]) {

        // Wipe lower items when recursing
        for( j=lv+1; j<levels.length; j++) levels[j] = 0;

        // Find the penultimate DOM item
        var t = toc;
        for( j=0; j<((lv - toclim[0]) * 2 - 1); j++)
          if(t.lastChild) t = t.lastChild;


        // Add a level of containers if necessary
        if ( levels[lv] == 1 && lv > toclim[0] ) t.appendChild(document.createElement(container));

        // Create the link node itself
        var a = document.createElement("a");
        a.setAttribute("href", "#" + hrefid + section);
        a.innerHTML = (link_nums ? section + ". "  : "") + node.innerHTML;

        // append link to TOC
        if( lv - toclim[0] > 0 ) t = t.lastChild;
        t.appendChild(document.createElement("li")).appendChild(a);
      }

      // Add numbering to headings if requested
      if(heading_nums && lv >= headlim[0] && lv <= headlim[1]) node.insertBefore(document.createTextNode(section + ". "), node.firstChild);
      node.id = hrefid + section;
    }
  }
}
