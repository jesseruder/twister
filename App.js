import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Audio, Speech, Permissions } from 'expo';

const DELAY_BEFORE_RECORDING = 500;
const RECORDING_BUFFER_TIME = 1000;
const LIST = [
  'She sells seashells by the seashore',
  'How can a clam cram in a clean cream can?',
  'I scream, you scream, we all scream for ice cream',
  'I saw Susie sitting in a shoeshine shop',
  'Susie works in a shoeshine shop. Where she shines she sits, and where she sits she shines',
  'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn’t fuzzy, was he?',
  'Can you can a can as a canner can can a can?',
  'I have got a date at a quarter to eight; I’ll see you at the gate, so don’t be late',
  'You know New York, you need New York, you know you need unique New York',
  'I saw a kitten eating chicken in the kitchen',
  'If a dog chews shoes, whose shoes does he choose?',
  'I thought I thought of thinking of thanking you',
  'I wish to wash my Irish wristwatch',
  'Near an ear, a nearer ear, a nearly eerie ear',
  'Eddie edited it',
  'Willie’s really weary',
  'A big black bear sat on a big black rug',
  'Tom threw Tim three thumbtacks',
  'He threw three free throws',
  'Nine nice night nurses nursing nicely',
  'So, this is the sushi chef',
  'Four fine fresh fish for you',
  'Wayne went to wales to watch walruses',
  'Six sticky skeletons. Six sticky skeletons. Six sticky skeletons',
  'Which witch is which? Which witch is which? Which witch is which?',
  'Snap crackle pop. Snap crackle pop. Snap crackle pop',
  'Flash message. Flash message. Flash message',
  'Red Buick, blue Buick. Red Buick, blue Buick. Red Buick, blue Buick',
  'Red lorry, yellow lorry. Red lorry, yellow lorry. Red lorry, yellow lorry',
  'Thin sticks, thick bricks. Thin sticks, thick bricks. Thin sticks, thick bricks',
  'Stupid superstition. Stupid superstition. Stupid superstition',
  'Eleven benevolent elephants. Eleven benevolent elephants. Eleven benevolent elephants',
  'Two tried and true tridents. Two tried and true tridents. Two tried and true tridents',
  'Rolling red wagons. Rolling red wagons. Rolling red wagons',
  'Black back bat. Black back bat. Black back bat',
  'She sees cheese. She sees cheese. She sees cheese',
  'Truly rural. Truly rural. Truly rural',
  'Good blood, bad blood. Good blood, bad blood. Good blood, bad blood',
  'Pre-shrunk silk shirts. Pre-shrunk silk shirts. Pre-shrunk silk shirts',
  'Ed had edited it. Ed had edited it. Ed had edited it',
  'We surely shall see the sun shine soon',
  'Which wristwatches are Swiss wristwatches?',
  'Fred fed Ted bread, and Ted fed Fred bread',
  'I slit the sheet, the sheet I slit, and on the slitted sheet I sit',
  'A skunk sat on a stump and thunk the stump stunk, but the stump thunk the skunk stunk',
  'Lesser leather never weathered wetter weather better',
  'Of all the vids I’ve ever viewed, I’ve never viewed a vid as valued as Alex’s engVid vid'
];

export default class App extends React.Component {
  state = {
    text: '',
  };

  _speak = (text, onDone) => {
    Speech.speak(text, {
      onDone,
      rate: 0.8,
    });
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    this.beepSound = new Audio.Sound();
    await this.beepSound.loadAsync(require('./assets/beep.mp3'));

    this._startRound();
  }

  _getTime = () => {
    return new Date().getTime();
  };

  _startRound = () => {
    let text = LIST[Math.floor(Math.random() * LIST.length)];
    this.setState({
      text,
    });

    let startTime = this._getTime();
    this._speak(text, () => {
      let endTime = this._getTime();

      setTimeout(() => {
        this._startRecordingAsync(endTime - startTime + RECORDING_BUFFER_TIME);
      }, DELAY_BEFORE_RECORDING);
    });
  };

  _playBeepAsync = async () => {
    await this.beepSound.setPositionAsync(0);
    await this.beepSound.playAsync();
  };

  _startRecordingAsync = async (duration) => {
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await this._playBeepAsync();
    await recording.startAsync();
    setTimeout(async () => {
      await recording.stopAndUnloadAsync();
      await this._playBeepAsync();
      let sound = (await recording.createNewLoadedSound()).sound;
      let duration = (await recording.getStatusAsync()).durationMillis;
      this._playSoundAsync(sound, duration);
    }, duration);
  };

  _playSoundAsync = async (sound, duration) => {
    await sound.setPositionAsync(0);
    await sound.playAsync();

    setTimeout(() => {
      this._startRound();
    }, duration);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, paddingLeft: 20, paddingRight: 20}}>{this.state.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
