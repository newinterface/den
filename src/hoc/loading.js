import React from 'react';
import branch from 'src/recompose/branch';
import {renderComponent} from 'src/recompose/renderComponent';
import {ActivityIndicator} from 'react-native';
import {ThemedView, ThemeConsumer} from 'src/components';

const Loading = () => {
  return (
    <ThemeConsumer>
      {({theme}) => (
        <ThemedView isFullView style={styles.viewLoading}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </ThemedView>
      )}
    </ThemeConsumer>
  );
};
const styles = {
  viewLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
const isLoading = ({loading}) => loading;

export const withLoading = branch(isLoading, renderComponent(Loading));
