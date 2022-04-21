import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeConsumer} from 'src/components';
import {borderRadius, padding} from 'src/components/config/spacing';

const Item3 = props => {
  const {width, style} = props;
  const sizeImage = width - 2 * padding.base;
  const position = 'absolute';
  return (
    <ThemeConsumer>
      {({theme}) => (
        <View style={style && style}>
          <View
            style={[
              styles.view,
              {
                width,
                height: width + 80,
                backgroundColor: theme.colors.bgColorSecondary,
              },
            ]}
          />
          <View
            style={{
              width: sizeImage,
              height: sizeImage,
              borderRadius: sizeImage / 2,
              backgroundColor: theme.colors.bgColorThird,
              position: position,
              left: padding.base,
            }}
          />
        </View>
      )}
    </ThemeConsumer>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: borderRadius.large,
    marginTop: 45,
  },
});

export default Item3;
