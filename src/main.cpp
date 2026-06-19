#include <iostream>
#include "galaxia/Communicator.h"

int main() {
    std::cout << "Galaxia Star Communicators C++ starter" << std::endl;

#if defined(_WIN32)
    std::cout << "Platform: Windows" << std::endl;
#elif defined(__APPLE__)
    std::cout << "Platform: macOS" << std::endl;
#else
    std::cout << "Platform: Other" << std::endl;
#endif

    Galaxia::Communicator comm;
    comm.start();
    comm.sendMessage("Hello from C++ starter!");
    std::string r = comm.receiveMessage();
    std::cout << "Received (stub): " << r << std::endl;
    comm.stop();

    return 0;
}
