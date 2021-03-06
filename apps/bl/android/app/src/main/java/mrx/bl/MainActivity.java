package mrx.bl;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Build;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;

// react-native-splash-screen >= 0.3.1
import org.devio.rn.splashscreen.SplashScreen; // here

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "bl";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);  // here
    super.onCreate(savedInstanceState);



    try {
      PackageInfo info = getPackageManager().getPackageInfo("mrx.bl", PackageManager.GET_SIGNATURES);
      for (Signature signature : info.signatures) {
        MessageDigest md = MessageDigest.getInstance("SHA");
        md.update(signature.toByteArray());
        Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
      }

      Log.d("Build.VERSION_CODES", String.valueOf(Build.VERSION.SDK_INT));
      Log.d("Build.VERSION_CODES", String.valueOf(Build.VERSION_CODES.LOLLIPOP_MR1));

//      if ( String.valueOf(Build.VERSION.SDK_INT).equals(String.valueOf(Build.VERSION_CODES.LOLLIPOP_MR1))) {
////        if (Build.VERSION.SDK_INT != Build.VERSION_CODES.ICE_CREAM_SANDWICH_MR1) {
//          getWindow().setFlags(
//                  WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
//                  WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
////        }
//      }

      if (Build.VERSION.SDK_INT != Build.VERSION_CODES.LOLLIPOP_MR1) {
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
      }
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
    }
  }
}
