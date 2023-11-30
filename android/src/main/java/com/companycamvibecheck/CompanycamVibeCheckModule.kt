package com.companycamvibecheck

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Context
import android.os.PowerManager

class CompanycamVibeCheckModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  fun multiply(a: Double, b: Double, promise: Promise) {
    promise.resolve(a * b)
  }
  val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
  @ReactMethod
  fun getThermalState(promise: Promise) {
    promise.resolve(powerManager.currentThermalStatus);
  }

  companion object {
    const val NAME = "CompanycamVibeCheck"
  }
}
