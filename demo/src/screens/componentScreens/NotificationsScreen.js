import React, { Component } from 'react';
import {StyleSheet } from 'react-native';
import { View, Constants, PageControl, Notification, Carousel, Button, Colors} from 'react-native-ui-lib'; // eslint-disable-line

export default class AvatarsScreen extends Component {

  state = {
    currentPage: 0,
    showNotification: false,
  }

  render() {
    return (
      <View flex>

        <Carousel
          onChangePage={currentPage => this.setState({ currentPage })}
          initialPage={this.state.currentPage}
        >
          <View style={styles.page} bg-red50>
            <Notification visible message="Discount was added to 3 products" />
          </View>

          <View style={styles.page} bg-green50>
            <Notification
              visible
              message="Discount was added to 3 products"
              actions={[{ label: 'Undo', onPress: () => alert('undo') }]}
            />
          </View>
          <View style={styles.page} bg-dark50>
            <Notification visible message="Discount was added to 3 products" allowDismiss onDismiss={() => alert('dismiss!')} />
          </View>

          <View flex center style={styles.page} bg-violet70>
            <Notification
              visible={this.state.showNotification}
              message="Notification can appear at the bottom"
              position="bottom"
              allowDismiss
              onDismiss={() => this.setState({showNotification: false})}
            />
            <Button size="medium" label="Show Notification" onPress={() => this.setState({ showNotification: true })} />
          </View>

          <View style={styles.page} bg-yellow70>
            <Notification
              visible
              message="Notfication with different color"
              backgroundColor={Colors.white}
              color={Colors.dark10}
              allowDismiss
            />
          </View>

          <View style={styles.page} bg-orange70>
            <Notification
              visible
              message="Do you approve user request?"
              centerMessage
              backgroundColor={Colors.white}
              color={Colors.blue30}
              actions={[
                { label: 'Block', outline: true, outlineColor: Colors.blue30, color: Colors.blue30, onPress: () => alert('block!') },
                { label: 'Approve', onPress: () => alert('approve!') },
              ]}
            />
          </View>

          <View center flex style={styles.page} bg-violet70>
            <Notification
              message="Do you approve user request?"
              allowDismiss
              onDismiss={() => this.setState({ showNotification: false })}
              visible={this.state.showNotification}
            />
            <Button size="medium" label="Show Notification" onPress={() => this.setState({ showNotification: true })} />
          </View>

        </Carousel>
        <PageControl
          containerStyle={styles.pageControl}
          numOfPages={6}
          currentPage={this.state.currentPage}
          color={Colors.dark10}
          size={15}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    width: Constants.screenWidth,
    flex: 1,
  },
  pageControl: {
    position: 'absolute',
    bottom: 70,
    width: Constants.screenWidth,
  },
});
