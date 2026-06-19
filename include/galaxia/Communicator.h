#pragma once

#include <string>

namespace Galaxia {

class Communicator {
public:
    Communicator();
    ~Communicator();

    // Start/stop the communicator core
    void start();
    void stop();

    // Send a message (stub)
    void sendMessage(const std::string &msg);

    // Receive a message (stub) - returns a placeholder
    std::string receiveMessage();

private:
    bool running_;
};

} // namespace Galaxia
