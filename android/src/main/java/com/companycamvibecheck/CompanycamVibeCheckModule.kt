package com.companycamvibecheck

import android.app.ActivityManager
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
  val activityManager = reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

  @ReactMethod
  fun getThermalState(promise: Promise) {
    promise.resolve(powerManager.currentThermalStatus);
  }

  @ReactMethod
  fun getMemoryInfo(promise: Promise) {
    val memoryInfo = ActivityManager.MemoryInfo()
    // val activityManager = reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    activityManager.getMemoryInfo(memoryInfo)
    val runtime = Runtime.getRuntime()
    print("MEMORY INFO!!!")
    print(memoryInfo.availMem)
    promise.resolve(memoryInfo.availMem)
    // promise.resolve(10)
  }

  private fun getAvailableMemory(): ActivityManager.MemoryInfo {
    return ActivityManager.MemoryInfo().also { memoryInfo ->
        activityManager.getMemoryInfo(memoryInfo)
    }
  }


//   private fun getMemoryInfo(): CharSequence? {
//     val memoryInfo = ActivityManager.MemoryInfo()
//     val activityManager = getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
//     activityManager.getMemoryInfo(memoryInfo)
//     val runtime = Runtime.getRuntime()
//     val builder = StringBuilder()
//     builder.append("Available Memory: ")
//     .append(memoryInfo.availMem)
//     .append("\n")
//     .append("Total Memory: ")
//     .append(memoryInfo.totalMem)
//     .append("")
//     .append("Runtime Maximum Memory: ")
//     .append(runtime.maxMemory())
//     .append("")
//     .append("Runtime Total Memory:")
//     .append(runtime.totalMemory())
//     .append("")
//     .append("Runtime Free Memory:")
//     .append(runtime.freeMemory())
//     .append("")
//     return builder.toString()
//  }



  companion object {
    const val NAME = "CompanycamVibeCheck"
  }
}
