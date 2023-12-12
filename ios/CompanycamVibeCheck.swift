import Foundation

@objc(CompanycamVibeCheck)
class CompanycamVibeCheck: NSObject {
  let notificationCenter: NotificationCenter;
  var currentThermalState: String
    
  override
  init () {
      self.notificationCenter = NotificationCenter.default;
      let initThermalState = ProcessInfo.processInfo.thermalState;
      self.currentThermalState = "";
      super.init();
      self.parseThermalState(thermalState: initThermalState);
      
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

  func parseThermalState(thermalState: ProcessInfo.ThermalState) -> Void {
    switch thermalState {
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

  @objc
  func queryThermalState(_ notification: NSNotification) -> Void {
    let state = ProcessInfo.processInfo.thermalState
    self.parseThermalState(thermalState: state);
  }

  @objc(getThermalState: rejecter:)
  func getThermalState(resolve: RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
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