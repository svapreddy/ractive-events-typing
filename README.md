ractive-events-typing
=====================

RactiveJS Live typing plugin for beforetyping, typing, paused, stopped, events on textbox, textarea and editable div

Usage :

Include ractive-events-typing.js file after ractive.js file

And then use it like below  
 
     <input type="text" on-typing="typeState" />
     // or
     <div contenteditable=true on-typing="typeState"></div>
     // or 
     <textarea on-typing="typeState"></textarea>
     
JS :

    ractive.on('typeState', function(event) {
        console.log(event.typingState, event.sourceKey);
    });
    
Possible values for `event.typingState`

  1. beforetyping
  2. typing
  3. paused
  4. stopped
  
Note : event.sourceKey value will be "paste" if pasted else "typed" while typing.

Demo Link : http://jsfiddle.net/nh96Lesd/2/
