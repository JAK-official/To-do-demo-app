import { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';

export default function AddItem() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  function saveNote() {
    if (!note.trim()) return;

    console.log("New note:", note);

    setNote("");
    setOpen(false);
  }

  return (
    <>
      <Pressable
        style={styles.button}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.plus}>+</Text>
      </Pressable>


      <Modal
        visible={open}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>

          <View style={styles.dialog}>

            <Text style={styles.title}>
              New Note
            </Text>


            <TextInput
              style={styles.input}
              placeholder="Write something..."
              placeholderTextColor="grey"
              value={note}
              onChangeText={setNote}
            />


            <View style={styles.row}>

              <Pressable
                onPress={() => setOpen(false)}
              >
                <Text style={styles.cancel}>
                  Cancel
                </Text>
              </Pressable>


              <Pressable
                onPress={saveNote}
              >
                <Text style={styles.save}>
                  Add
                </Text>
              </Pressable>

            </View>

          </View>

        </View>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({

  button:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor:"blue",
    justifyContent:"center",
    alignItems:"center",
    paddingBottom:3,
  },

  plus:{
    color:"white",
    fontSize:35,
    textAlign:"center",
  },


  overlay:{
    flex:1,
    backgroundColor:"black",
    justifyContent:"center",
    padding:20,
  },


  dialog:{
    backgroundColor:"black",
    padding:20,
    borderRadius:15,
  },


  title:{
    color:"white",
    fontSize:22,
    marginBottom:15,
  },


  input:{
    backgroundColor:"grey",
    color:"white",
    padding:12,
    borderRadius:10,
  },


  row:{
    flexDirection:"row",
    justifyContent:"flex-end",
    gap:20,
    marginTop:20,
  },


  cancel:{
    color:"#aaa",
    fontSize:16,
  },


  save:{
    color:"white",
    fontSize:16,
  }

});