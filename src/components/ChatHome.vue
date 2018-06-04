<template>
    <div class="container-fluid">
      <div class="row">
        <div class="headerBackground">
          <h3 style="padding-top:  20px;">{{ msg }}</h3>
          <span class="logoutButton" @click="logout">
            Logout
          </span>
        </div>
        <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
          <div v-if="messages.length <= 0">
            Fetching Data...
          </div>
          <div v-for="message in messages" class="card">
            <div class="card-body">
              <h6 class="card-subtitle text-muted"> Nickname: {{ message.nick }}</h6>

              <p class="card-text" v-if="message !== editingMessage"> Message: {{ message.text }}</p>
              <textarea v-else v-model="messageText" class="form-control"></textarea>

              <div class="editButtons">
                <span v-if="!editingMessage">
                <a @click.prevent="editMessage(message)" class="card-link card-link-2">Edit</a>
                <a @click.prevent="deleteMessage(message)" class="card-link">Delete</a>
                </span>
                <span v-if="editingMessage">
                  <a @click.prevent="cancelEditMessage" class="card-link card-link-3">Cancel</a>
                  <a @click.prevent="updateMessage" class="card-link card-link-4">Update</a>
                </span>
              </div>
            </div>
          </div>
          <hr>
          <form v-if="!editingMessage" @submit.prevent="storeMessage">
            <div class="form-group">
              <label for="">Message: </label>
              <textarea v-model="messageText" class="form-control"></textarea>
            </div>
            <div class="form-group">
              <label for="">Nickname: </label>
              <input type="text" v-model="nick" class="form-control">
            </div>
            <button class="btn btn-primary"> Send </button>
          </form>
        </div>
      </div>  
    </div>
</template>

<script>
import firebase from 'firebase';
import nativeToast from 'native-toast';

export default {
  data () {
    return {
      msg: 'A Vue Chat App With Firebase Realtime Database',
      messages: [],
      messageText: '',
      nick: '',
      db_reference: firebase.database().ref('messages'),
      editingMessage: null
    }
  },
  methods: {
    storeMessage() {
      // Get a reference to the database service
      // let database = firebase.database();
      // this.messages.push({text: this.messageText, nick: this.nick});
      this.db_reference.push().set({text: this.messageText, nick: this.nick});
      this.messageText = '';
      this.nick = '';
    },
    deleteMessage(message) {
      this.db_reference.child(message.id).remove();
    },
    cancelEditMessage() {
      this.editingMessage = null;
      this.messageText = '';
    },
    editMessage(message) {
      this.editingMessage = message;
      this.messageText = message.text;
    },
    updateMessage(){
      this.db_reference.child(this.editingMessage.id).update({text: this.messageText});
      this.cancelEditMessage();
    },
    logout() {
      firebase.auth().signOut().then(userLoggedOut => {
        nativeToast({
            message: 'Logout Successful !!!',
            type: 'success',
            icon: false
        })
        this.$router.replace('login');
      })
    }
  },
  created() {
    // Get a reference to the database service
    // let database = firebase.database();

    //snapshot gives us access to the value and other things like the key etc.
    // value = snapshot.val() | Key = snapshot.key

    // To make the object have everything in the array, we need to make use of the spread operations and also pass in a second argument
    // which is the key of the message. We have done that below. 
    this.db_reference.on('child_added', snapshot => {
      this.messages.push({...snapshot.val(), id: snapshot.key});
      nativeToast({
        message: `New Message Added by ${snapshot.val().nick}`,
        type: 'success',
        icon: false
       })
    });

    // this.db_reference.on('child_added', snapshot => {
    //   this.messages.push(snapshot.val());
    // })

    // Method to make the DOM note and implement the delete method. 
    this.db_reference.on('child_removed', snapshot => {
      const deleteMessage = this.messages.find(message => {
        message.id === snapshot.key;
      })
      const index = this.messages.indexOf(deleteMessage);
      this.messages.splice(index, 1);
      nativeToast({
        message: `Message Deleted by ${snapshot.val().nick}`,
        type: 'success',
        icon: false
       })
    });

    // Method to make the DOM note and implement the update method
    this.db_reference.on('child_changed', snapshot => {
      const updatedMessage = this.messages.find(message => message.id === snapshot.key);
      updatedMessage.text = snapshot.val().text;
      nativeToast({
        message: `Message Updated by ${snapshot.val().nick}`,
        type: 'success',
        icon: false
       })
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.card {
  border: 1px solid #aaa;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
}
.editButtons {
  margin-top: 10px;
}
.card-link {
  cursor: pointer;
  background: red;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}
.card-link-2 {
  background: blue;
}
.card-link-3 {
  background: orangered;
}
.card-link-4 {
  background: green;
}
.headerBackground {
  height: 70px;
  background: Green;
  color: white;
  text-align: center;
  margin-top: -20px;
  margin-bottom: 20px;
}
.logoutButton{
    float: right;
    right: 20px;
    position: absolute;
    top: 25px;
    cursor: pointer;
}
</style>
