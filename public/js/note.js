/**
 * Constructor for notes
 * Checks the server for newer versions of the nodes
 */
function Note(data) {
  var self = this;
  console.log("In Note constructor got data: " + data);
  self.data = typeof(data) != 'undefined' ? data : {};
};


/**
 * Saves a node to the local datastore
 * and to the server.
 * @returns:
 *    an array of notes
 */
Note.prototype.destroy = function() {
  var self = this;
  $.ajax({
    type: 'DELETE',
    url: '/user/sebastian/notes/' + self.data.noteId,
    success: self.postDestroyHook
  });
};


/**
 * Destroys a particular note
 * @void
 */
Note.prototype.save = function() {
  var self = this;
  // Update the lastModified time
  self.data.lastModified = new Date().getTime();
  // If it is a new object, set the createdAt time
  if (self.data.createdAt == null) {
    self.data.createdAt = new Date().getTime();
  };
  // Create or update as needed.
  if (self.data.noteId == null) {
    // This is a new item, create it
    console.log("Creating note: " + self);
    $.post("/user/sebastian/notes", self.data, function(data) {
      self.postCreateUpdateHook(data);
    }, "json");
  } else {
    // This is an existing item, update it
    var noteId = self.data.noteId;
    $.put('/user/sebastian/notes/' + noteId, self.data, function(data) { self.postCreateUpdateHook(data); }, "json");
  };
};


/**
 * This method is called after a the server has received an updated note.
 * It tells the NodeController to update its local store accordingly.
 * @void
 */
Note.prototype.postCreateUpdateHook = function(noteData) {
  var self = this;
  self.data = noteData; // Update the local data state
  noteController.addToLocalStore(noteData);
};


/**
 * This method is called after a note has been deleted.
 * It removes it from the local 
 * It tells the NoteController to update its local store accordingly.
 * @void
 */
Note.prototype.postDestroyHook = function(noteData) {
  noteContoller.removeFromLocalStore(noteData.data.noteId);
};


/**
 * Getter for the note id
 * @returns 
 *    the notes unique id
 */
Note.prototype.noteId = function() {
  return this.data.nodeId;
};
