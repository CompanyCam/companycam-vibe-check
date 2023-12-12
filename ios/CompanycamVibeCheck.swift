import Foundation

@objc(CompanycamVibeCheck)
class CompanycamVibeCheck: NSObject {


    // private let notificationCenter: NotificationCenter
    // NotificationCenter.default.addObserver(
    // self,
    // selector: #selector(reactToThermalStateChange(_:)),
    // name: ProcessInfo.thermalStateDidChangeNotification,
    // object: nil
    // )
    
//    NotificationCenter.default.addObserver(
//        self,
//        selector: #selector(self.batteryLevelChanged),
//        name: UIDevice.batteryLevelDidChangeNotification,
//        object: nil)

    
    let notificationCenter: NotificationCenter;
    var currentThermalState: String
    
    override
  init () {
      self.notificationCenter = NotificationCenter.default;
      let temp = ProcessInfo.processInfo.thermalState;
      self.currentThermalState = "unknown";
      super.init();
      
      self.notificationCenter.addObserver(
        self,
        selector: #selector(self.queryThermalState),
        name: ProcessInfo.thermalStateDidChangeNotification,
        object: nil
      );
  }

  deinit {
    self.notificationCenter.removeObserver(self);
  }

    @objc
    func queryThermalState(_ notification: NSNotification) -> Void {
      print("hello world")
      print(notification.name)
    let state = ProcessInfo.processInfo.thermalState
    // print state value to console
    print("stateQuery: ', \(state)");
      print("goodbye world")
    // var stateString: String
    switch state {
    case .nominal:
        self.currentThermalState = "nominal"
    case .fair:
        self.currentThermalState = "fair"
    case .serious:
        self.currentThermalState = "serious"
    case .critical:
        self.currentThermalState = "critical"
    @unknown default:
        self.currentThermalState = "unknown"
    }
  }

  @objc(getThermalState: rejecter:)
  func getThermalState(resolve: RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
      
      // put all this business into a function because maybe this is the wrong way to do it
    // let state = queryThermalState()

      print("currentThermalState: ', \(self.currentThermalState)");
      resolve(self.currentThermalState)
  }

    func memoryFootprint() -> mach_vm_size_t? {
        // The `TASK_VM_INFO_COUNT` and `TASK_VM_INFO_REV1_COUNT` macros are too
        // complex for the Swift C importer, so we have to define them ourselves.
        let TASK_VM_INFO_COUNT = mach_msg_type_number_t(MemoryLayout<task_vm_info_data_t>.size / MemoryLayout<integer_t>.size)
        let TASK_VM_INFO_REV1_COUNT = mach_msg_type_number_t(MemoryLayout.offset(of: \task_vm_info_data_t.min_address)! / MemoryLayout<integer_t>.size)
        var info = task_vm_info_data_t()
        var count = TASK_VM_INFO_COUNT
        let kr = withUnsafeMutablePointer(to: &info) { infoPtr in
            infoPtr.withMemoryRebound(to: integer_t.self, capacity: Int(count)) { intPtr in
                task_info(mach_task_self_, task_flavor_t(TASK_VM_INFO), intPtr, &count)
            }
        }
        guard
            kr == KERN_SUCCESS,
            count >= TASK_VM_INFO_REV1_COUNT
        else { return nil }
        return info.phys_footprint
    }
    
  @objc(getMemoryInfo: rejecter:)
  func getMemoryInfo(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let memoryUsed = memoryFootprint()
    resolve(memoryUsed);

  }
}


// public enum ThermalState {
//     /// The thermal state is within normal limits.
//     case nominal
//     /// The thermal state is slightly elevated.
//     case fair
//     /// The thermal state is high.
//     case serious
//     /// The thermal state is significantly impacting the performance of the system and the device needs to cool down.
//     case critical
//   }

//   /// Returns the current thermal state of the system (or nil if not called against the `current` device)
//   public var thermalState: ThermalState? {
//     guard isCurrent else { return nil }
//     switch ProcessInfo().thermalState {
//       case .nominal:
//         return .nominal
//       case .fair:
//         return .fair
//       case .serious:
//         return .serious
//       case .critical:
//         return .critical
//       @unknown default:
//         return .nominal
//     }
//   }
