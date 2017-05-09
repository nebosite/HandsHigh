using Android.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.HandsHigh.ForAndroid
{
    class AndroidGameRunner: GameRunner
    {
        public View GetViewService()
        {
            return (View)_controller.GetService(typeof(View));
        }

    }
}
