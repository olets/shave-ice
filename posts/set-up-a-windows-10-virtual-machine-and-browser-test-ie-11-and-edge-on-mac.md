---
title: Set Up a Windows 10 Virtual Machine and Run Internet Explorer 11 and Edge on Mac or Linux
description: Run a full Windows 10 computer on your Mac (or Linux!) computer, legally and for free. Test websites on IE11 and Edge with full access to browser developer tools, at full speed & with confidence that you're seeing exactly what your Windows users see.
date: 2019-02-20
tags:
  - internet explorer
  - virtual machine
layout: layouts/post.njk
original:
  source: viget.com
  url: https://www.viget.com/articles/set-up-a-windows-10-virtual-machine-and-browser-test-ie-11-and-edge-on-mac/
imageFilename: hotel-real-santiago-de-campostela.jpg
imageDetails:
  license:
    name: Public domain
  title: "Hospital Real, Santiago de Compostela: view of the courtyard showing the fountain. Photograph, ca.1900"
  url: https://wellcomecollection.org/works/qda5ch4n
id: 20537
---

*This article is part of a series on running cross-browser tests directly on your primary computer. The first in the series is [Set Up Simulator and Test iOS Mobile Safari on Mac]({{ "/posts/set-up-simulator-and-test-ios-mobile-safari-on-mac"|url }}).*

------



According to [one well known source of desktop browser marketshare data](http://gs.statcounter.com/), in November 2018 Internet Explorer usage was at 2.8% in the United States and 5.05% worldwide; Edge usage was at 2.15% in the United States and 4.25% worldwide. Not much perhaps compared to the leader Chrome (61.77% in the U.S., 49.13% worldwide) or even the runner up Safari (15.09% in the U.S., 32.38% worldwide). But that means as many as 1 in 20 United States users could be using either IE or Edge, and *that* means it's well worth considering testing your site in Microsoft browsers. (Each site's audience is different, and the decision to spend time and money to make grumpy IE11 match a comp should be made with that site's traffic in mind.)

Internet Explorer and Edge only run on Microsoft operating systems. For front-end developers and quality assurance testers on Mac or Linux computers, those browsers are often tested when development is nearly finished, using a paid web app such as BrowserStack or CrossBrowserTesting aimed at visual QA more than debugging or high-fidelity UX testing.

A Windows 10 "virtual machine" (VM) —in lay terms, think a full additional computer in an app on your computer— puts full true Microsoft browser testing at your fingertips. 

This guide will get you set up with a Windows 10 VM. It takes 30-40 minutes, plus the time to download a 5GB disk image. You will need at least 25GB of disk space, but 50GB is recommended to give Windows 10 space to grow over time. You'll use free software, including a full copy of Windows 10 provided for free by Microsoft.

## Get set up to run "virtual machines"

There are various tools out there for running virtual machines (VMs). We'll use VirtualBox - it's free, it works great, it's being actively developed, and it's available for every operating system.

1. Download [VirtualBox](https://www.virtualbox.org/)
2. Run the VirtualBox installer

## Get Windows 10

Installers come on physical media (DVDs or thumb drives) or in disk image files (typically `.iso`) You'll use `.iso` files for your VirtualBox VMs. Microsoft provides Windows 10 `iso` for free! Go to the [Download Windows 10 Disc Image (ISO File)](https://www.microsoft.com/en-us/software-download/windows10ISO) page. You'll be asked to make some choices:

1. **Select your edition**

   As of this writing, the available options were an update a couple months old and an update a couple months older than that. Go with the most recent.

2. **Select your language**

   For English users, I go with "English" over "English International." The international version uses British spellings in the Windows UI — "colour," for example, as opposed to the American "color." There are some claims out there that the International version is problematically different. I don't know if that's true or not. I do know that "English" (which means American English) can be configured to use non-American keyboard mappings.

3. **Select your processor**

   Don't know if your computer is 32-bit or 64-bit? It's probably 64-bit. Apple for example hasn't made a 32-bit computer since 2011. If you have a Mac, you can double check by going to the Apple menu and selecting "About This Mac": if the "Processor" is Core Duo it's 32-bit, anything else is 64; if you have a PC, you'll just have to look it up!

## Create your virtual machine

1. Open VirtualBox, and click "New"
2. Fill out the "Name." Using the OS as the name is a good convention, and will help you keep track of things later on. And if you name the VM after the OS, VirtualBox will automatically select the "Type" and "Version".
3. On the next screen, bump the "Memory size." The default is 2048MB (2GB). 4096MB (4GB) is a good place to start. If your computer has at least 16GB of RAM, consider giving 8192MB (8GB) to the virtual machine. You can always change this later if you find it makes your actual computer too slow when the virtual is running.

4. On the next two screens, follow the defaults for:

   - "Hard disk" ("create a virtual disk")
   - "Hard disk file type" (VDI)

5. For "Storage on physical hard disk," choose "Dynamically allocated." With this setting, the amount of space your virtual machine takes up on your real machine depends on exactly what virtual machine needs. With a "fixed size" virtual machine, the virtual machine reserves the amount of storage you specify even if you specify more than it needs. Dynamic allocation has a significant long-term benefit: you'll be able to non-destructively modify the maximum size setting. This is relevant to Windows 10, which in my experience will need more and more storage, even if you don't install anything new. In about a year and a half, I saw one Windows 10 virtual machine's needs increase by about 15GB. Because it was "fixed size," I was not able to change the disk size without losing data.

6. The "File location and size" gives you an opportunity to change where on your computer you keep the files related to this VM. I do not recommend renaming the virtual hard disk file — historically, depending on the operating system, that could confuse things. But if you want to change the location, click the folder icon and select the location. I keep my VMs in a "VMs" folder in my home folder.

   For the "Size," stick with the default 50GB. Remember that thanks to dynamic storage allocation your virtual machine should end up taking less space than this — expect a final size of around 20GB.

7. Hit "Create"!

8. In VirtualBox's sidebar, select your new "Windows 10" and then click on the large gear "Settings" button.

   - In 

     General > Advanced

     ,

     - set the clipboard to bidirectional shared
     - and set drag'n'drop to bidirectional shared

   - In *Network > Adapter 1* switch from "NAT" to "Bridged Adapter". This will give your virtual machine access to any local servers running on the host.

   - Note that in *System > Motherboard* you can up the memory, and in *System > Processor* you can increase the number of processors. The default 1 works well for me, but if you want to play around with things that's where to do it.

## Put Windows on the VM

When you're done with the settings, hit okay. Now double click on your VM in the VirtualBox sidebar. Click the "browse" icon, and locate the `.iso` you downloaded.

At this point I recommend closing all other apps that take a lot of memory.

 

### Installation

Hit "Start", and you should see the Windows 10 installer start up. Follow the installer.

1. When asked to "Activate Windows" with a product key, select "I don't have a product key."
2. When asked to select your edition, I choose Pro. The N versions do not include Windows Media Player, Windows Media Center, and Windows DVD Maker, in compliance with European Commision anti-trust regulation. There are plenty of articles out there on the difference between Home, Pro, Education, and all the rest. For me a key difference is that Pro allows you to install Windows updates on your own schedule, whereas with Home they must be installed within a day. Of course it's always good to now wait on installing system upgrades, but in my case I fire up Windows 10 every couple months to check some front-end oddity, and don't want to worry that I might be forced to run an upgrade.
3. When asked to choose your installation type, say "Custom." This doesn't try to migrate anything from an existing install.
4. You should have only one option for where to install Windows 10. Install it! The installer will run, the virtual machine will restart, some other stuff will install, the virtual machine will restart, and then you'll be looking at the Windows 10 setup.
5. The following details reflect English Windows Pro, October 2018 update. It's possible your setup process will differ.
6. Confirm your region and your keyboard layout when asked to. When asked to choose between "set up for personal use" and "set up for an organization" choose personal.
7. You'll be asked to sign in with a Microsoft account. If you don't want your virtual machine connected to a Microsoft account, don't worry: we'll walk through removing it later. For now, if you don't have an account, create one:
   1. Click "create account"
   2. Click "Get a new email address"
   3. For the email address, I use a password manager to generate a few words strung together with periods
   4. For the alternate address, I create a second new email (for example with Gmail or another new Outlook account)
8. I go with *not* having an enhanced online experience and *not* receiving promotional emails.
9. The installer will chug away for a little bit, and then you'll have to create a PIN.
10. Next up is a request link to your phone. I choose "Do it later."
11. Then the installer pushes OneDrive. I choose "Only save files to this PC."
12. On the Cortana confirmation screen I "Decline." My hope is that this will save a little disk space.
13. On the activity history screen, say "No."
14. In the privacy settings, say "No" to everything, and the "Accept."

That should be it for configuration. In a minute or two, after the installer spins for a bit, you should be looking at a Windows 10 computer! Now you can safely delete the Windows 10 disk image you downloaded at the start.

### Post-installation

Now we'll remove that Microsoft account.

1. Click the Windows icon in the taskbar
2. Click the settings' gear icon
3. Select "Accounts"
4. In "Your Info," scroll down and select "Sign in with a local account instead"
5. Fill in the password for the account you created, and then create a new account and password. This is the password you'll need to type every time you log into Windows 10. The login screen doesn't support pasting, so you'll want to make it something you can handle without relying on your password manager.
6. Say "Sign out and finish"
7. Click or press any key to trigger the login dialog. Use your PIN or local password to log in. By default the PIN login is selected. If desired, switch to password login by clicking "Sign-in Options" and then selecting the key icon.
8. When Windows 10 starts up, it will probably report a problem connecting to OneDrive. Just close that warning.

## Finish setting up your VM

It's time to introduce some VM lingo: the computer on which the VM is installed is called **the host**, and the VM is called **the guest**. In this case, the Windows 10 machine is the guest, and your physical computer's system is the host.

VirtualBox provides a set of tools to extend your VM's powers, do support things like copying text in the host and pasting in the guest. The tools are called Guest Additions. Install them!

1. Up in the host's menubar, select *Devices > Insert Guest Additions CD Image…*
2. The installer should run automatically. If it doesn't, click the folder icon in the taskbar to open the File Explorer. In the sidebar, expand "This PC," select "CD Drive (D:) VirtualBox Guest Additions," and double click on the app "VBoxWindowsAdditions."
3. Follow the defaults, and restart the guest.

## Get familiar with your VirtualBox VM

### Sizing the VirtualBox window

VirtualBox has several display options, configurable from the host's *View* menu. *Note that you must install the Guest Additions, above, for these to work correctly.*

1. By **default**, the guest appears in a window. Resizing the window changes the dimensions of the virtual screen.
2. **Auto-resize Guest Display**, on by default, resizes the guest's dimensions to fit the window. If you uncheck it and decrease the host window's size, the guest's screen will stay the same and you'll be able to scroll around in the host window.
3. **Full screen** makes the VM full screen. Great if you want to feel like you're really in the guest's OS.
4. **Seamless** integrates the guest's windows with the host's. Useful when you need to see something on the guest and the host at the same time, and have limited screen real estate.
5. **Scaled** puts the VM in a window, where the guest's screen stretches to fill the window. Handy if you need to zoom in. Hold shift when resizing the window to maintain the aspect ratio.

After playing around with the options, you might have trouble getting back to the defaults. The trick is to select *no* Mode option.

### Switching between the host and the guest

When you're in a VirtualBox VM, all keystrokes are sent to the guest. To toggle this and send keystrokes to the host instead, hit the **host key**.

The current host key is named in the bottom right corner of the VM window. The icon immediately next to it, a downward-pointing arrow, indicates whether keystrokes are going "down" into guest. If it's lit up green, keystrokes are going to the guest; otherwise keystrokes are going to the host.

Use the host key, for example, to switch to a different host app. I find this especially handy in full screen mode: I hit the host key, then trigger the host's app switcher.

The host key can be customized. In the host's menubar, select *VirtualBox VM > Preferences > Input > Virtual Machine*.

### Shutting down and starting up

Think of your VM as a real computer. Just as you turn a physical computer off with the operating system's "shut down" process, you should turn off your VM with *its* "shut down" process. That means that to turn off your Windows VM you don't quit the VirtualBox instance, you send the shut down signal from the Windows menu: open the menu and, click the power icon, and choose to turn the computer off. VirtualBox will automatically close the container app.

To turn on a VirtualBox VM, open VirtualBox and either select your VM and hit the "Start" button or simply double click the VM you want to start. You can also start the VM by opening its `.vbox` file. If you want to do that (for example, if you want to keep the VM in your Dock) and don't remember the location you chose back in the VM setup step, right on the VM in VirtualBox and choose the "show" option.

## Get those browsers!

Your system is all set up! Windows 10 comes with Edge and Internet Explorer 11.

To access IE11, open the Windows menu and start typing "internet explorer". Once it's open, you can right-click its icon in the taskbar and select "Pin to taskbar."

Just for completeness, I like to install Chrome and Firefox. The process is familiar to anyone familiar with Windows, but that might not be you!

1. With Edge, find the Chrome download link. Click download. Say you want to "Run" the downloaded file. The Windows Defender icon will appear in the taskbar. Click it. Say "Yes" to letting the installer modify your computer. Let the installer run. When Chrome opens, right-click on its icon in the taskbar, and select "Pin to taskbar."
2. In one of your open browsers, find the Firefox download link. Again, download, choose "Run," click the blinking shield in the taskbar, say "Yes," and let the installer run. When Firefox opens, pin its icon to the sidebar.

I remove the Mail and Store icons from the taskbar: right click on them, and select "Unpin from taskbar".

I remove the Cortana search field from the taskbar: right click on an empty part of the taskbar, or on the Cortana search field, and in "Cortana" select "Hidden."

There you go, you're ready to test any Windows 10 browser right from your own computer!