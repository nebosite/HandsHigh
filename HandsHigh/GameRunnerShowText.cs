#region Using Statements
using System;
using System.Reflection;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using MonoVarmint.Widgets;
using System.Text;
using System.Collections.Generic;
using Microsoft.Xna.Framework.Content;
using System.Diagnostics;
using System.IO;

#endregion

namespace com.HandsHigh
{
    //-----------------------------------------------------------------------------------------------
    // 
    //-----------------------------------------------------------------------------------------------
    public abstract partial class GameRunner: IDisposable
    {
        public string BigMessageText { get; set; }
        public float BigTextSize {  get { return ScreenSize.Y * 1.5f; } }

        void ShowBigMessage()
        {
            var yUp = -.2f;
            BigMessageText = "I Love You!";
            _controller.SetScreen("ShowText");
            var bigMessage = _controller.GetVisibleWidgetByName("BigMessage");
            _controller.SelectFont("Fonts/BigFont");
            var size = _controller.MeasureText(BigMessageText, BigTextSize);

            Action restartAnimation = null;
            restartAnimation = () =>
            {
                var animation = VarmintWidgetAnimation.MoveOffsetLinear(5, new Vector2(1, yUp), new Vector2(-size.X, yUp));
                animation.OnComplete += restartAnimation;
                bigMessage.AddAnimation(animation);

            };
            restartAnimation();
        }
    }
}
