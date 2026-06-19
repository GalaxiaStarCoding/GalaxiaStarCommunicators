cmake_minimum_required(VERSION 3.16)
project(GalaxiaStarCommunicatorsCpp VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include headers
include_directories(include)

# Main executable
add_executable(galaxia_cpp
  src/main.cpp
  src/Communicator.cpp
)

target_include_directories(galaxia_cpp PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)

# Basic tests
enable_testing()
add_executable(test_basic
  tests/test_basic.cpp
  src/Communicator.cpp
)

target_include_directories(test_basic PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
add_test(NAME basic_test COMMAND test_basic)
