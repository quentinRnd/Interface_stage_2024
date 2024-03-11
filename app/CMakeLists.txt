cmake_minimum_required(VERSION 3.22.1 FATAL_ERROR)

# C++20 project
project(stage_interface_web LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fail compilation at many warning
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Werror -Wfatal-errors -Wshadow")

# Default values
if(NOT CMAKE_BUILD_TYPE)
	set(CMAKE_BUILD_TYPE Release)
endif()
if(NOT DROGON_CTL)
	set(DROGON_CTL drogon_ctl)
endif()

# Conan install
set(ENV{BUILD_TYPE} ${CMAKE_BUILD_TYPE})
if(CONAN_HOME)
	set(ENV{CONAN_HOME} ${CONAN_HOME})
endif()
execute_process(
	COMMAND conan install --profile=${CMAKE_CURRENT_SOURCE_DIR}/conan/profile.txt ${CMAKE_CURRENT_SOURCE_DIR}/conan/file.txt --output-folder=${CMAKE_BINARY_DIR} --build=missing
	RESULT_VARIABLE conan_install_result    
)
if(NOT conan_install_result EQUAL 0)
  message(FATAL_ERROR "conan install failed")
endif()

# Setup conan
include(${CMAKE_BINARY_DIR}/build/${CMAKE_BUILD_TYPE}/generators/conan_toolchain.cmake)

# Build CSP views (https://drogonframework.github.io/drogon-docs/#/ENG-06-View?id=automated-processing-of-csp-files)
# Warning: This code require that the absolute path of the parent folder does not contain whitespaces
file(GLOB SCP_LIST ${CMAKE_CURRENT_SOURCE_DIR}/source/views/*.csp)
foreach(csp_file ${SCP_LIST})
	message(STATUS "csp_file:" ${csp_file})
	exec_program(basename ARGS "-s .csp ${csp_file}" OUTPUT_VARIABLE class_name)
	message(STATUS "view class_name:" ${class_name})
	add_custom_command(OUTPUT ${class_name}.h ${class_name}.cc
		COMMAND "${DROGON_CTL}"
		ARGS create view ${csp_file}
		DEPENDS ${csp_file}
		VERBATIM 
	)
	set(VIEWS_SRC ${VIEWS_SRC} ${class_name}.cc)
endforeach()

# Generate the project executable
add_executable(${PROJECT_NAME}
	source/main.cpp
	source/controllers/Index.cpp
	${VIEWS_SRC}
)

# Get packages
find_package(Drogon CONFIG REQUIRED)

find_package(jsoncpp REQUIRED)


# Link librairies
target_link_libraries(${PROJECT_NAME} PRIVATE Drogon::Drogon)

target_link_libraries(${PROJECT_NAME} PRIVATE JsonCpp::JsonCpp)