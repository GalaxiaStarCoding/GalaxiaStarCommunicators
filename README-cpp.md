# GalaxiaStarCommunicators — C++ starter

This branch (cpp-starter) contains a minimal C++ cross-platform starter targeted at Windows and macOS.

What is included
- CMakeLists.txt — build system (CMake 3.16+, C++17)
- include/galaxia/Communicator.h — small Communicator class interface
- src/Communicator.cpp — trivial implementation with stubs
- src/main.cpp — console app demonstrating startup and communicator usage
- tests/test_basic.cpp — very small test that exercises Communicator

Build instructions (macOS / Windows)

Prerequisites
- CMake 3.16 or newer
- A C++17-capable compiler
  - macOS: Xcode command line tools (clang) or Homebrew gcc
  - Windows: Visual Studio (MSVC) or MSYS2/MinGW

Build (out-of-source)

mkdir build
cd build
cmake ..
cmake --build . --config Release

Run the app
- macOS / Linux: ./galaxia_cpp
- Windows (MSVC multi-config): .\Release\galaxia_cpp.exe

Run tests
ctest --output-on-failure

Next steps
- Replace the console UI with a cross-platform GUI (Qt/QML recommended for native apps), or integrate into Electron/React for a web-style UI.
- Add real networking (Boost.Asio or WebRTC for audio/video), and persistent storage (SQLite).
- Add dependency management with vcpkg or Conan.

If you'd like, I can now:
- Add a Qt/QML skeleton instead of a console app (larger changes), or
- Add a Boost.Asio TCP example, or
- Add WebRTC integration notes and stubs.
